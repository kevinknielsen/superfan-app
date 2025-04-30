"use client"

import { Music, FileText, Trash2, Play, Pause, Upload, X } from "lucide-react"
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

export default function Step1ProjectInfo({ onNext }: Step1Props) {
  const { projectData, updateField } = useCreateProject()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

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
      // Check if file is an audio file
      if (!file.type.startsWith("audio/")) {
        setErrors((prev) => ({ ...prev, trackDemo: "Please upload an audio file" }))
        return
      }

      updateField("trackDemo", file)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      updateField("trackDemoPreview", previewUrl)

      // Clear error
      if (errors.trackDemo) {
        setErrors((prev) => ({ ...prev, trackDemo: "" }))
      }
    }
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
    if (projectData.trackDemoPreview) {
      URL.revokeObjectURL(projectData.trackDemoPreview)
      updateField("trackDemoPreview", null)
    }
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
          Tell us about your music project. This information will be displayed to potential investors.
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
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your project in a few sentences..."
            value={projectData.description}
            onChange={handleChange}
            className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          <p className="text-gray-500 text-sm mt-1">{projectData.description.length}/500 characters (minimum 20)</p>
        </div>

        <div>
          <Label className={errors.artwork ? "text-red-500" : ""}>Upload Artwork</Label>
          <div className="mt-2">
            {projectData.artworkPreview ? (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={projectData.artworkPreview || "/placeholder.svg"}
                  alt="Project artwork preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeArtwork}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
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
              <div className="relative flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="mr-4">
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="w-10 h-10 flex items-center justify-center bg-[#0f172a] text-white rounded-full"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex-grow">
                  <p className="font-medium truncate">{projectData.trackDemo?.name || "Track Demo"}</p>
                  <p className="text-sm text-gray-500">
                    {projectData.trackDemo ? formatFileSize(projectData.trackDemo.size) : ""}
                  </p>
                  <audio ref={audioRef} src={projectData.trackDemoPreview} className="hidden" />
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
