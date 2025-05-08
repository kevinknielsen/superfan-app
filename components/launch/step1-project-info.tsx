"use client"

import { Music, FileText, Trash2, Play, Pause, Upload, X, Mic, HelpCircle } from "lucide-react"
import { useState, type ChangeEvent, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useLaunchProject } from "@/contexts/launch-project-context"
import supabase from '@/lib/supabaseClient'
import { useAuth } from "@/contexts/auth-context"

interface Step1Props {
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

interface FileData {
  name: string
  type: string
  size: number
  lastModified: number
  data: File
}

interface DemoTrackFile {
  id: string
  file: File
  title: string
  previewUrl: string
  isPlaying: boolean
  currentTime: number
  duration: number
}

interface ProjectData {
  title: string
  artistName: string
  description: string
  artwork?: File
  artworkPreview?: string
  demoTracks: DemoTrackFile[]
  voiceNote?: File
  voiceNotePreview?: string
  additionalFiles?: File[]
  id?: string
}

const ROLE_OPTIONS = [
  { value: 'Artist', label: 'Artist' },
  { value: 'Producer', label: 'Producer' },
  { value: 'Arranger', label: 'Arranger' },
  { value: 'Songwriter', label: 'Songwriter' },
  { value: 'Musician', label: 'Musician' },
  { value: 'Vocalist', label: 'Vocalist' },
  { value: 'Engineer', label: 'Engineer' },
  { value: 'Mixer', label: 'Mixer' },
  { value: 'Mastering', label: 'Mastering' },
  { value: 'Assistant', label: 'Assistant' },
  { value: 'Tech', label: 'Tech' },
  { value: 'Curator', label: 'Curator' }
];

export default function Step1ProjectInfo({ onNext }: Step1Props) {
  const { projectData, updateField } = useLaunchProject()
  const { user } = useAuth()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [waveformData, setWaveformData] = useState<number[]>([])
  const [currentTip, setCurrentTip] = useState(0)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({})
  const voiceNoteRef = useRef<HTMLAudioElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const [hasMounted, setHasMounted] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Artist');

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

  useEffect(() => { setHasMounted(true); }, []);

  // Add cleanup for blob URLs
  useEffect(() => {
    return () => {
      // Cleanup blob URLs when component unmounts
      projectData.demoTracks?.forEach(demo => {
        if (demo.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(demo.previewUrl)
        }
      })
    }
  }, [projectData.demoTracks])

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

  const handleTrackDemoChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newDemos: DemoTrackFile[] = []
    const existingDemos = projectData.demoTracks || []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file) {
        continue;
      }

      // Validate file
      if (!(file instanceof File)) {
        continue;
      }

      if (file.size > 20 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          trackDemo: "File size must be less than 20MB",
        }))
        continue
      }

      const id = `demo-${Date.now()}-${i}`
      const previewUrl = URL.createObjectURL(file)
      
      // Create a new File object to ensure we have all properties
      const newFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });

      newDemos.push({
        id,
        file: newFile,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        previewUrl,
        isPlaying: false,
        currentTime: 0,
        duration: 0
      })
    }

    if (newDemos.length > 0) {
      updateField("demoTracks", [...existingDemos, ...newDemos])
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
    const audioElement = audioRefs.current[e.target.id]
    if (audioElement) {
      audioElement.currentTime = newTime
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

  const togglePlayPause = (demoId: string) => {
    const audioElement = audioRefs.current[demoId]
    if (!audioElement) return

    const demos = [...projectData.demoTracks]
    const demoIndex = demos.findIndex(demo => demo.id === demoId)
    if (demoIndex === -1) return

    // Stop all other playing demos
    demos.forEach((demo, index) => {
      if (index !== demoIndex && demo.isPlaying) {
        const otherAudio = audioRefs.current[demo.id]
        if (otherAudio) {
          otherAudio.pause()
        }
        demos[index] = { ...demo, isPlaying: false }
      }
    })

    // Toggle current demo
    if (demos[demoIndex].isPlaying) {
      audioElement.pause()
      demos[demoIndex] = { ...demos[demoIndex], isPlaying: false }
    } else {
      audioElement.play()
      demos[demoIndex] = { ...demos[demoIndex], isPlaying: true }
    }

    updateField("demoTracks", demos)
  }

  const handleTimeUpdate = (demoId: string) => {
    const audioElement = audioRefs.current[demoId]
    if (!audioElement) return

    const demos = [...projectData.demoTracks]
    const demoIndex = demos.findIndex(demo => demo.id === demoId)
    if (demoIndex === -1) return

    demos[demoIndex] = {
      ...demos[demoIndex],
      currentTime: audioElement.currentTime,
      duration: audioElement.duration
    }

    updateField("demoTracks", demos)
  }

  const handleDemoTitleChange = (demoId: string, newTitle: string) => {
    const demos = projectData.demoTracks.map(demo => 
      demo.id === demoId ? { ...demo, title: newTitle } : demo
    )
    updateField("demoTracks", demos)
  }

  const removeDemoTrack = (demoId: string) => {
    const demos = projectData.demoTracks.filter(demo => {
      if (demo.id === demoId) {
        // Cleanup blob URL when removing a demo
        if (demo.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(demo.previewUrl)
        }
        return false
      }
      return true
    })
    updateField("demoTracks", demos)
  }

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

  const handleNext = async () => {
    // Validate form before proceeding
    const isValid = validateForm()
    if (!isValid) return

    if (!user?.id) {
      setErrors((prev) => ({ ...prev, submit: 'User not authenticated' }))
      return
    }

    let coverArtUrl = null
    let voiceIntroUrl = null

    // 1. Upload files to Supabase Storage if present
    if (projectData.artwork) {
      // IMPORTANT: Upload as raw File/Blob, not FormData or multipart
      // This is the correct way using supabase-js:
      // The 'file' argument should be a File or Blob, not wrapped in FormData
      console.log('Uploading artwork file:', projectData.artwork);
      const { data, error } = await supabase.storage
        .from('project-assets')
        .upload(`cover-art/${crypto.randomUUID()}-${projectData.artwork.name}`, projectData.artwork)
      if (error) {
        console.error('Supabase upload error:', error);
        setErrors((prev) => ({ ...prev, artwork: 'Failed to upload cover art: ' + error.message }))
        return
      }
      coverArtUrl = supabase.storage.from('project-assets').getPublicUrl(data.path).data.publicUrl
    }
    if (projectData.voiceNote) {
      const { data, error } = await supabase.storage
        .from('project-assets')
        .upload(`voice-intro/${crypto.randomUUID()}-${projectData.voiceNote.name}`, projectData.voiceNote)
      if (error) {
        setErrors((prev) => ({ ...prev, voiceNote: 'Failed to upload voice intro' }))
        return
      }
      voiceIntroUrl = supabase.storage.from('project-assets').getPublicUrl(data.path).data.publicUrl
    }

    let demoTrackUrls: { id: string; url: string; title: string }[] = []

    // Upload all demo tracks
    for (const demo of projectData.demoTracks) {
      try {
        console.log('Uploading demo track:', {
          id: demo.id,
          name: demo.file.name,
          type: demo.file.type,
          size: demo.file.size,
          title: demo.title
        });

        if (!demo) {
          continue;
        }

        if (!demo.file) {
          continue;
        }

        if (!(demo.file instanceof File)) {
          continue;
        }

        console.log('Uploading demo track:', {
          id: demo.id,
          name: demo.file.name,
          type: demo.file.type,
          size: demo.file.size,
          title: demo.title
        });

        const sanitizedFileName = demo.file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `track-demo/${crypto.randomUUID()}-${sanitizedFileName}`;
        
        const { data, error } = await supabase.storage
          .from('project-assets')
          .upload(filePath, demo.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Demo track upload error:', error);
          setErrors((prev) => ({ 
            ...prev, 
            trackDemo: `Failed to upload demo track: ${error.message}` 
          }));
          return;
        }

        console.log('Demo track uploaded successfully:', data);
        const url = supabase.storage.from('project-assets').getPublicUrl(data.path).data.publicUrl;
        demoTrackUrls.push({ 
          id: demo.id, 
          url, 
          title: demo.title || demo.file.name.replace(/\.[^/.]+$/, "") 
        });
      } catch (err) {
        console.error('Unexpected error during demo track upload:', err);
        console.error('Demo track that caused the error:', demo);
        setErrors((prev) => ({ 
          ...prev, 
          trackDemo: 'An unexpected error occurred while uploading the demo track' 
        }));
        return;
      }
    }

    // 2. Insert project into Supabase DB
    try {
      console.log('Inserting project with data:', {
        title: projectData.title,
        artist_name: projectData.artistName,
        description: projectData.description,
        cover_art_url: coverArtUrl,
        voice_intro_url: voiceIntroUrl,
        privy_id: user.id,
        status: 'draft'
      });

      // First, get or create a user record
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('privy_id', user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching user:', userError);
        throw userError;
      }

      let userId;
      if (!userData) {
        // Create new user record
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            privy_id: user.id,
            email: user.email,
            name: user.name
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          throw createError;
        }
        userId = newUser.id;
      } else {
        userId = userData.id;
      }

      // Now create the project with the user's UUID
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: projectData.title,
          artist_name: projectData.artistName,
          description: projectData.description,
          cover_art_url: coverArtUrl,
          voice_intro_url: voiceIntroUrl,
          creator_id: userId,
          status: 'draft',
          platform_fee_pct: 5,
          early_curator_shares: false
        })
        .select('id');

      if (error) {
        console.error('Project insertion error:', error);
        setErrors((prev) => ({ 
          ...prev, 
          submit: `Failed to create project: ${error.message}` 
        }));
        return;
      }

      if (!data || !data[0]?.id) {
        console.error('No project ID returned after insertion');
        setErrors((prev) => ({ 
          ...prev, 
          submit: 'Failed to create project: No project ID returned' 
        }));
        return;
      }

      console.log('Project created successfully:', data[0]);

      // 3. Save projectId in context/global state
      if (typeof updateField === 'function') {
        updateField('id' as keyof ProjectData, data[0].id);
      }

      // Create demo tracks
      if (demoTrackUrls.length > 0) {
        const { error: demoError } = await supabase
          .from('demo_tracks')
          .insert(demoTrackUrls.map(demo => ({
            project_id: data[0].id,
            title: demo.title,
            url: demo.url
          })));

        if (demoError) throw demoError;
      }

      // Proceed to next step
      onNext();
    } catch (err) {
      console.error('Unexpected error during project creation:', err);
      setErrors((prev) => ({ 
        ...prev, 
        submit: 'An unexpected error occurred while creating the project' 
      }));
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

        {/* New Team Member Role Dropdown */}
        <div>
          <Label htmlFor="teamRole">Team Member Role</Label>
          <select
            id="teamRole"
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {ROLE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="description" className={errors.description ? "text-red-500" : ""}>
            Short Description
          </Label>
          <div className="relative">
            <Textarea
              id="description"
              name="description"
              placeholder="Tell fans why this release matters. Share the story, the vibe, or what makes it yours."
              value={projectData.description}
              onChange={handleChange}
              className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
            />
            <div className="absolute bottom-0 right-0 transform translate-y-full pt-2 flex items-center gap-2 text-gray-500 text-sm">
              <HelpCircle className="w-4 h-4" />
              <span>{tips[currentTip]}</span>
            </div>
          </div>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          {hasMounted && (
            <p className="text-gray-500 text-sm mt-1">
              {projectData.description.length}/500 characters (minimum 20)
            </p>
          )}
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
            Upload Track Demos
          </Label>
          <div className="mt-2 space-y-4">
            {projectData.demoTracks?.map((demo) => (
              <div key={demo.id} className="relative flex flex-col p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <button
                      type="button"
                      onClick={() => togglePlayPause(demo.id)}
                      className="w-10 h-10 flex items-center justify-center bg-[#0f172a] text-white rounded-full hover:bg-[#1e293b] transition-colors"
                      aria-label={demo.isPlaying ? "Pause" : "Play"}
                    >
                      {demo.isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={demo.title}
                      onChange={(e) => handleDemoTitleChange(demo.id, e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 font-medium"
                      placeholder="Enter demo title"
                    />
                    <p className="text-sm text-gray-500">
                      {formatTime(demo.currentTime)} / {formatTime(demo.duration)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDemoTrack(demo.id)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                    aria-label="Remove track demo"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-[#0f172a] rounded-full"
                    style={{ 
                      width: `${(demo.currentTime / demo.duration) * 100 || 0}%` 
                    }}
                  />
                </div>

                <audio
                  ref={(el) => {
                    if (el) {
                      audioRefs.current[demo.id] = el
                    }
                  }}
                  src={demo.previewUrl}
                  onTimeUpdate={() => handleTimeUpdate(demo.id)}
                  onEnded={() => {
                    const demos = [...projectData.demoTracks]
                    const index = demos.findIndex(d => d.id === demo.id)
                    if (index !== -1) {
                      demos[index] = { ...demos[index], isPlaying: false }
                      updateField("demoTracks", demos)
                    }
                  }}
                  className="hidden"
                />
              </div>
            ))}

            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="trackDemo"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Music className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> demo tracks
                  </p>
                  <p className="text-xs text-gray-500">MP3, WAV, FLAC (Max. 20MB each)</p>
                </div>
                <input
                  id="trackDemo"
                  type="file"
                  accept="audio/*"
                  multiple
                  className="hidden"
                  onChange={handleTrackDemoChange}
                />
              </label>
            </div>
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
                    onClick={removeVoiceNote}
                    className="w-10 h-10 flex items-center justify-center bg-[#0f172a] text-white rounded-full hover:bg-[#1e293b] transition-colors"
                    aria-label="Remove voice note"
                  >
                    <Trash2 className="w-5 h-5" />
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
