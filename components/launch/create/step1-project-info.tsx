"use client"

import { Music, FileText, Trash2, Play, Pause, Upload, X, Mic, HelpCircle } from "lucide-react"
import { useState, type ChangeEvent, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useCreateProject } from "@/contexts/create-project-context"

interface Step1Props {
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

interface ProjectData {
  title: string
  artistName: string
  description: string
  artwork?: File
  artworkPreview?: string
  trackDemo?: File
  trackDemoPreview?: string
  voiceNote?: File
  voiceNotePreview?: string
  additionalFiles?: File[]
}

export default function Step1ProjectInfo({ onNext }: Step1Props) {
  const { projectData, updateField } = useCreateProject()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [waveformData, setWaveformData] = useState<number[]>([])
  const [currentTip, setCurrentTip] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const voiceNoteRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  const tips = [
    "Need inspo? Check how @Jay dropped their last EP →",
    "Not sure what to say? Start with the vibe or collaborators.",
  ]

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 5000)
    return () => clearInterval(tipInterval)
  }, [])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateField(name as keyof typeof projectData, value)

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      updateField("artwork", file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      updateField("artworkPreview", previewUrl)

      // Clear error
      if (errors.artwork) {
        setErrors((prev) => ({ ...prev, artwork: "" }))
      }
    }
  }

  const handleTrackDemoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          trackDemo: "File size must be less than 20MB",
        }))
        return
      }
      updateField("trackDemo", file)
      const reader = new FileReader()
      reader.onload = () => {
        updateField("trackDemoPreview", reader.result as string)
        // Initialize audio context and analyser when file is loaded
        initializeAudioContext(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const initializeAudioContext = (audioData: string) => {
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    const audioContext = new (window.AudioContext as any)()
    audioContextRef.current = audioContext

    const analyser = audioContext.createAnalyser()
    analyserRef.current = analyser
    analyser.fftSize = 256

    const source = audioContext.createBufferSource()
    const audioElement = new Audio(audioData)

    audioElement.addEventListener('loadedmetadata', () => {
      setDuration(audioElement.duration)
    })

    audioElement.addEventListener('timeupdate', () => {
      setCurrentTime(audioElement.currentTime)
    })

    const sourceNode = audioContext.createMediaElementSource(audioElement)
    sourceNode.connect(analyser)
    analyser.connect(audioContext.destination)

    // Start analyzing the waveform
    updateWaveform()
  }

  const updateWaveform = () => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Normalize the data for visualization
    const normalizedData = Array.from(dataArray).map(value => value / 255)
    setWaveformData(normalizedData)

    animationFrameRef.current = requestAnimationFrame(updateWaveform)
  }

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleAdditionalFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // Convert FileList to array and add to existing files
      const newFiles = Array.from(files)
      const currentFiles = [...projectData.additionalFiles]

      // Add new files to the array
      updateField("additionalFiles", [...currentFiles, ...newFiles])

      // Create file info objects for display
      const newFileInfos = newFiles.map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      }))

      updateField("additionalFilesInfo", [...projectData.additionalFilesInfo, ...newFileInfos])
    }
  }

  const removeArtwork = () => {
    updateField("artwork", null)
    if (projectData.artworkPreview) {
      URL.revokeObjectURL(projectData.artworkPreview)
      updateField("artworkPreview", null)
    }
  }

  const removeTrackDemo = () => {
    updateField("trackDemo", null)
    updateField("trackDemoPreview", null)
    setIsPlaying(false)
  }

  const removeVoiceNote = () => {
    updateField("voiceNote", null)
    updateField("voiceNotePreview", null)
    setIsPlaying(false)
  }

  const removeAdditionalFile = (id: string) => {
    // Find the file index
    const fileIndex = projectData.additionalFilesInfo.findIndex((file) => file.id === id)
    if (fileIndex !== -1) {
      // Create new arrays without the removed file
      const newAdditionalFiles = [...projectData.additionalFiles]
      newAdditionalFiles.splice(fileIndex, 1)

      const newAdditionalFilesInfo = [...projectData.additionalFilesInfo]

      // Revoke object URL if it exists
      if (newAdditionalFilesInfo[fileIndex].preview) {
        URL.revokeObjectURL(newAdditionalFilesInfo[fileIndex].preview!)
      }

      newAdditionalFilesInfo.splice(fileIndex, 1)

      // Update state
      updateField("additionalFiles", newAdditionalFiles)
      updateField("additionalFilesInfo", newAdditionalFilesInfo)
    }
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle audio ended event
  useEffect(() => {
    const audioElement = audioRef.current

    const handleEnded = () => {
      setIsPlaying(false)
    }

    if (audioElement) {
      audioElement.addEventListener("ended", handleEnded)
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleEnded)
      }
    }
  }, [])

  const handleVoiceNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          voiceNote: "File size must be less than 20MB",
        }))
        return
      }
      updateField("voiceNote", file)
      const reader = new FileReader()
      reader.onload = () => {
        updateField("voiceNotePreview", reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!projectData.title.trim()) {
      newErrors.title = "Project title is required"
    }

    if (!projectData.artistName.trim()) {
      newErrors.artistName = "Artist name is required"
    }

    if (!projectData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (projectData.description.length < 20) {
      newErrors.description = "Description should be at least 20 characters"
    }

    if (!projectData.artwork) {
      newErrors.artwork = "Artwork is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Project Information</h2>
        <p className="text-gray-600 mb-6">
          Tell us about your music project.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className={errors.title ? "text-red-500" : ""}>
            Project Title
          </Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Summer EP Release"
            value={projectData.title}
            onChange={handleChange}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="artistName" className={errors.artistName ? "text-red-500" : ""}>
            Artist/Creator Name
          </Label>
          <Input
            id="artistName"
            name="artistName"
            placeholder="e.g., John Smith"
            value={projectData.artistName}
            onChange={handleChange}
            className={errors.artistName ? "border-red-500" : ""}
          />
          {errors.artistName && <p className="text-red-500 text-sm mt-1">{errors.artistName}</p>}
        </div>

        <div>
          <Label htmlFor="description" className={errors.description ? "text-red-500" : ""}>
            Short Description
          </Label>
          <div className="relative">
            <div className="absolute -top-8 left-0 right-0 bg-blue-50 p-3 rounded-lg mb-2">
              <p className="text-sm text-blue-800">
                "Tell fans why this release matters. Share the story, the vibe, or what makes it yours."
              </p>
              <p className="text-xs text-blue-600 mt-1 italic">
                "This is where I won over my first backers." — @LiaSounds
              </p>
            </div>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your project in a few sentences..."
              value={projectData.description}
              onChange={handleChange}
              className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
            />
            <div className="absolute -bottom-8 right-0 flex items-center gap-2 text-gray-500 text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>{tips[currentTip]}</span>
            </div>
          </div>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          <p className="text-gray-500 text-sm mt-1">{projectData.description.length}/500 characters (minimum 20)</p>
        </div>

        <div>
          <Label className={errors.artwork ? "text-red-500" : ""}>Upload Artwork</Label>
          <div className="mt-2">
            {projectData.artworkPreview ? (
              <div className="relative w-40 h-40 group">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 to-transparent rounded-lg transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="absolute inset-0 border-4 border-gray-200 rounded-lg transform transition-transform group-hover:scale-105" />
                <img
                  src={projectData.artworkPreview || "/placeholder.svg"}
                  alt="Project artwork preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeArtwork}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="artwork"
                  className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                    errors.artwork ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (Max. 5MB)</p>
                  </div>
                  <input
                    id="artwork"
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
            {errors.artwork && <p className="text-red-500 text-sm mt-1">{errors.artwork}</p>}
          </div>
        </div>

        {/* Track Demo Upload Section */}
        <div className="mt-6">
          <Label htmlFor="trackDemo" className={errors.trackDemo ? "text-red-500" : ""}>
            Upload Track Demo (Optional)
          </Label>
          <div className="mt-2">
            {projectData.trackDemoPreview ? (
              <div className="relative flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <button
                      type="button"
                      onClick={togglePlayPause}
                      className="w-10 h-10 flex items-center justify-center bg-[#0f172a] text-white rounded-full hover:bg-[#1e293b] transition-colors"
                      aria-label={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium truncate">{projectData.trackDemo?.name || "Track Demo"}</p>
                    <p className="text-sm text-gray-500">Tap to preview</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeTrackDemo}
                    className="ml-2 text-gray-500 hover:text-red-500"
                    aria-label="Remove track demo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Waveform Visualizer */}
                <div className="w-full h-16 mb-2 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    {waveformData.length > 0 ? (
                      <div className="w-full h-full flex items-center">
                        {waveformData.map((value, index) => (
                          <div
                            key={index}
                            className="h-full flex-1 mx-0.5 bg-[#0f172a] rounded-sm"
                            style={{ height: `${value * 100}%` }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-400 text-sm">Loading waveform...</div>
                    )}
                  </div>
                </div>

                {/* Progress Slider */}
                <div className="w-full flex items-center gap-2">
                  <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSliderChange}
                    className="flex-1 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0f172a]"
                  />
                  <span className="text-xs text-gray-500">{formatTime(duration)}</span>
                </div>

                <audio ref={audioRef} src={projectData.trackDemoPreview} className="hidden" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="trackDemo"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Music className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> a track demo
                    </p>
                    <p className="text-xs text-gray-500">MP3, WAV, FLAC (Max. 20MB)</p>
                  </div>
                  <input
                    id="trackDemo"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleTrackDemoChange}
                  />
                </label>
              </div>
            )}
            {errors.trackDemo && <p className="text-red-500 text-sm mt-1">{errors.trackDemo}</p>}
          </div>
        </div>

        {/* Voice Note Upload Section */}
        <div className="mt-6">
          <Label htmlFor="voiceNote">Add a voice intro for your fans (optional)</Label>
          <div className="mt-2">
            {projectData.voiceNotePreview ? (
              <div className="relative flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="mr-4">
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="w-10 h-10 flex items-center justify-center bg-[#0f172a] text-white rounded-full hover:bg-[#1e293b] transition-colors"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex-grow">
                  <p className="font-medium truncate">Voice Note</p>
                  <p className="text-sm text-gray-500">30s max</p>
                  <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                    <div className="w-1/3 h-full bg-[#0f172a] rounded-full"></div>
                  </div>
                  <audio ref={voiceNoteRef} src={projectData.voiceNotePreview} className="hidden" />
                </div>
                <button
                  type="button"
                  onClick={removeVoiceNote}
                  className="ml-2 text-gray-500 hover:text-red-500"
                  aria-label="Remove voice note"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="voiceNote"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
                >
                  <div className="flex flex-col items-center justify-center pt-3 pb-3">
                    <Mic className="w-6 h-6 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">Click to record</span> a 30s voice note
                    </p>
                  </div>
                  <input
                    id="voiceNote"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleVoiceNoteChange}
                  />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Additional Files Upload Section */}
        <div className="mt-6">
          <Label htmlFor="additionalFiles">Additional Files (Optional)</Label>
          <p className="text-sm text-gray-500 mb-2">
            Upload any additional files that might help explain your project (PDFs, docs, images, etc.)
          </p>

          {/* File list */}
          {projectData.additionalFilesInfo.length > 0 && (
            <div className="mb-4 space-y-2">
              {projectData.additionalFilesInfo.map((file) => (
                <div key={file.id} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="mr-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAdditionalFile(file.id)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                    aria-label={`Remove ${file.name}`}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="additionalFiles"
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
            >
              <div className="flex flex-col items-center justify-center pt-3 pb-3">
                <FileText className="w-6 h-6 mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> additional files
                </p>
              </div>
              <input
                id="additionalFiles"
                type="file"
                multiple
                className="hidden"
                onChange={handleAdditionalFilesChange}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleNext} className="w-full bg-[#0f172a] hover:bg-[#1e293b]">
          Continue to Royalty Splits
        </Button>
      </div>
    </div>
  )
}
