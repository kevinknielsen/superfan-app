"use client";

import { Music, FileText, Trash2, Play, Pause, Upload, X, Mic, HelpCircle } from "lucide-react";
import { useState, type ChangeEvent, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useLaunchProject } from "@/contexts/launch-project-context";
import supabase from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/auth-context";

interface Step1Props {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface ProjectData {
  title: string;
  artistName: string;
  description: string;
  artwork?: File;
  artworkPreview?: string;
  trackDemo?: File;
  trackDemoPreview?: string;
  voiceNote?: File;
  voiceNotePreview?: string;
  additionalFiles?: File[];
  id?: string;
}

function FileUpload({
  label,
  accept,
  onChange,
  error,
  preview,
  onRemove,
}: {
  label: string;
  accept: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  preview?: string | null;
  onRemove?: () => void;
}) {
  return (
    <div>
      <Label className={error ? "text-red-500" : ""}>{label}</Label>
      <div className="mt-2">
        {preview ? (
          <div className="relative w-40 h-40 group">
            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                aria-label="Remove uploaded file"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <label
            htmlFor={label}
            className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">{accept}</p>
            </div>
            <input id={label} type="file" accept={accept} className="hidden" onChange={onChange} />
          </label>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
}

// Utility function to sanitize file names
const sanitizeFileName = (fileName: string): string => {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
};

// Utility function to create a sanitized file
const createSanitizedFile = (file: File): File => {
  const sanitizedFileName = sanitizeFileName(file.name);
  return new File([file], sanitizedFileName, { type: file.type });
};

export default function Step1ProjectInfo({ onNext }: Step1Props) {
  const { projectData, updateField } = useLaunchProject();
  const { user, isAuthenticated } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [currentTip, setCurrentTip] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const voiceNoteRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [hasMounted, setHasMounted] = useState(false);

  const tips = [
    "Need inspo? Check how @Jay dropped their last EP →",
    "Not sure what to say? Start with the vibe or collaborators.",
  ];

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof typeof projectData, value);

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          artwork: "File size must be less than 20MB",
        }));
        return;
      }

      // Use the utility function to create a sanitized file
      const sanitizedFile = createSanitizedFile(file);

      updateField("artwork", sanitizedFile);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      updateField("artworkPreview", previewUrl);

      // Clear error
      if (errors.artwork) {
        setErrors((prev) => ({ ...prev, artwork: "" }));
      }
    }
  };

  const handleTrackDemoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          trackDemo: "File size must be less than 20MB",
        }));
        return;
      }

      // Use the utility function to create a sanitized file
      const sanitizedFile = createSanitizedFile(file);

      updateField("trackDemo", sanitizedFile);
      const reader = new FileReader();
      reader.onload = () => {
        updateField("trackDemoPreview", reader.result as string);
        // Initialize audio context and analyser when file is loaded
        initializeAudioContext(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const initializeAudioContext = (audioData: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const audioElement = new Audio(audioData);
    audioElement.addEventListener("loadedmetadata", () => setDuration(audioElement.duration));
    audioElement.addEventListener("timeupdate", () => setCurrentTime(audioElement.currentTime));

    const sourceNode = audioContextRef.current.createMediaElementSource(audioElement);
    sourceNode.connect(analyser);
    analyser.connect(audioContextRef.current.destination);

    // Start analyzing the waveform
    updateWaveform();
  };

  const updateWaveform = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Normalize the data for visualization
    const normalizedData = Array.from(dataArray).map((value) => value / 255);
    setWaveformData(normalizedData);

    animationFrameRef.current = requestAnimationFrame(updateWaveform);
  };

  useEffect(() => {
    return () => {
      if (projectData.artworkPreview) URL.revokeObjectURL(projectData.artworkPreview);
      if (projectData.trackDemoPreview) URL.revokeObjectURL(projectData.trackDemoPreview);
      if (projectData.voiceNotePreview) URL.revokeObjectURL(projectData.voiceNotePreview);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAdditionalFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convert FileList to array and add to existing files
      const newFiles = Array.from(files).map((file) => createSanitizedFile(file));
      const currentFiles = [...projectData.additionalFiles];

      // Add new files to the array
      updateField("additionalFiles", [...currentFiles, ...newFiles]);

      // Create file info objects for display
      const newFileInfos = newFiles.map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      }));

      updateField("additionalFilesInfo", [...projectData.additionalFilesInfo, ...newFileInfos]);
    }
  };

  const removeArtwork = () => {
    updateField("artwork", null);
    if (projectData.artworkPreview) {
      URL.revokeObjectURL(projectData.artworkPreview);
      updateField("artworkPreview", null);
    }
  };

  const removeTrackDemo = () => {
    updateField("trackDemo", null);
    updateField("trackDemoPreview", null);
    setIsPlaying(false);
  };

  const removeVoiceNote = () => {
    updateField("voiceNote", null);
    updateField("voiceNotePreview", null);
    setIsPlaying(false);
  };

  const removeAdditionalFile = (id: string) => {
    // Find the file index
    const fileIndex = projectData.additionalFilesInfo.findIndex((file) => file.id === id);
    if (fileIndex !== -1) {
      // Create new arrays without the removed file
      const newAdditionalFiles = [...projectData.additionalFiles];
      newAdditionalFiles.splice(fileIndex, 1);

      const newAdditionalFilesInfo = [...projectData.additionalFilesInfo];

      // Revoke object URL if it exists
      if (newAdditionalFilesInfo[fileIndex].preview) {
        URL.revokeObjectURL(newAdditionalFilesInfo[fileIndex].preview!);
      }

      newAdditionalFilesInfo.splice(fileIndex, 1);

      // Update state
      updateField("additionalFiles", newAdditionalFiles);
      updateField("additionalFilesInfo", newAdditionalFilesInfo);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle audio ended event
  useEffect(() => {
    const audioElement = audioRef.current;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    if (audioElement) {
      audioElement.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleEnded);
      }
    };
  }, []);

  const handleVoiceNoteChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          voiceNote: "File size must be less than 20MB",
        }));
        return;
      }

      // Use the utility function to create a sanitized file
      const sanitizedFile = createSanitizedFile(file);

      updateField("voiceNote", sanitizedFile);
      const reader = new FileReader();
      reader.onload = () => {
        updateField("voiceNotePreview", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!projectData.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!projectData.artistName.trim()) {
      newErrors.artistName = "Artist name is required";
    }

    if (!projectData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (projectData.description.length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }

    if (!projectData.artwork) {
      newErrors.artwork = "Artwork is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!isAuthenticated || !user) {
      setErrors((prev) => ({ ...prev, submit: "You must be logged in to create a project." }));
      return;
    }
    if (validateForm()) {
      let coverArtUrl = null;
      let trackDemoUrl = null;
      let voiceIntroUrl = null;

      try {
        // 1. Upload files to Supabase Storage if present
        if (projectData.artwork) {
          console.log("Uploading artwork file:", projectData.artwork);
          const { data: artworkData, error: artworkError } = await supabase.storage
            .from("project-assets")
            .upload(`cover-art/${crypto.randomUUID()}-${projectData.artwork.name}`, projectData.artwork);
          if (artworkError) {
            console.error("Supabase upload error:", artworkError);
            setErrors((prev) => ({ ...prev, artwork: "Failed to upload cover art: " + artworkError.message }));
            return;
          }
          coverArtUrl = supabase.storage.from("project-assets").getPublicUrl(artworkData.path).data.publicUrl;
        }

        if (projectData.trackDemo) {
          const { data: trackData, error: trackError } = await supabase.storage
            .from("project-assets")
            .upload(`track-demo/${crypto.randomUUID()}-${projectData.trackDemo.name}`, projectData.trackDemo);
          if (trackError) {
            console.error("Track demo upload error:", trackError);
            setErrors((prev) => ({ ...prev, trackDemo: "Failed to upload track demo: " + trackError.message }));
            return;
          }
          trackDemoUrl = supabase.storage.from("project-assets").getPublicUrl(trackData.path).data.publicUrl;
        }

        if (projectData.voiceNote) {
          const { data: voiceData, error: voiceError } = await supabase.storage
            .from("project-assets")
            .upload(`voice-intro/${crypto.randomUUID()}-${projectData.voiceNote.name}`, projectData.voiceNote);
          if (voiceError) {
            console.error("Voice intro upload error:", voiceError);
            setErrors((prev) => ({ ...prev, voiceNote: "Failed to upload voice intro: " + voiceError.message }));
            return;
          }
          voiceIntroUrl = supabase.storage.from("project-assets").getPublicUrl(voiceData.path).data.publicUrl;
        }

        // 2. Insert project into Supabase DB
        console.log("Creating project with data:", {
          title: projectData.title,
          artist_name: projectData.artistName,
          description: projectData.description,
          cover_art_url: coverArtUrl,
          track_demo_url: trackDemoUrl,
          voice_intro_url: voiceIntroUrl,
          creator_id: user.id,
          status: "draft",
          platform_fee_pct: 2.5,
          early_curator_shares: false,
        });

        const { data, error } = await supabase
          .from("projects")
          .insert({
            title: projectData.title,
            artist_name: projectData.artistName,
            description: projectData.description,
            cover_art_url: coverArtUrl,
            track_demo_url: trackDemoUrl,
            voice_intro_url: voiceIntroUrl,
            creator_id: user.id,
            status: "draft",
            platform_fee_pct: 2.5,
            early_curator_shares: false,
          })
          .select("id");

        if (error) {
          console.error("Project creation error:", error);
          setErrors((prev) => ({ ...prev, submit: "Failed to create project: " + error.message }));
          return;
        }

        if (!data || !data[0]?.id) {
          console.error("No project ID returned after creation");
          setErrors((prev) => ({ ...prev, submit: "Failed to create project: No project ID returned" }));
          return;
        }

        // 3. Save projectId in context/global state
        if (typeof updateField === "function") {
          updateField("id" as keyof ProjectData, data[0].id);
        }

        // Proceed to next step
        onNext();
      } catch (error: any) {
        console.error("Unexpected error during project creation:", error);
        setErrors((prev) => ({
          ...prev,
          submit: "An unexpected error occurred: " + (error.message || "Unknown error"),
        }));
      }
    }
  };

  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = async (file: File, folder: string) => {
    const { data, error } = await supabase.storage
      .from("project-assets")
      .upload(`${folder}/${crypto.randomUUID()}-${file.name}`, file);

    if (error) {
      console.error(`Failed to upload ${folder}:`, error);
      return { error: error.message };
    }

    return { url: supabase.storage.from("project-assets").getPublicUrl(data.path).data.publicUrl };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Project Information</h2>
        <p className="text-gray-600 mb-6">Tell us about your music project.</p>
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
            aria-label="Project title"
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
            aria-label="Artist or creator name"
          />
          {errors.artistName && <p className="text-red-500 text-sm mt-1">{errors.artistName}</p>}
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
              aria-label="Project description"
            />
          </div>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          {hasMounted && (
            <p className="text-gray-500 text-sm mt-1">{projectData.description.length}/500 characters (minimum 20)</p>
          )}
        </div>

        <div>
          <FileUpload
            label="Upload Artwork"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            error={errors.artwork}
            preview={projectData.artworkPreview}
            onRemove={removeArtwork}
          />
        </div>

        {/* Track Demo Upload Section */}
        <div className="mt-6">
          <Label htmlFor="trackDemo" className={errors.trackDemo ? "text-red-500" : ""}>
            Upload Track Demo (Optional)
          </Label>
          <div className="mt-2">
            {projectData.trackDemoPreview ? (
              <div className="relative flex flex-col p-4 bg-white text-[#0f172a] rounded-lg border border-[#a259ff]">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <button
                      type="button"
                      onClick={togglePlayPause}
                      className="w-10 h-10 flex items-center justify-center bg-[#0f172a] text-white rounded-full hover:bg-[#1e293b] transition-colors"
                      aria-label={isPlaying ? "Pause audio" : "Play audio"}
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
                  <span className="text-xs text-gray-500" aria-live="polite">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSliderChange}
                    className="flex-1 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0f172a]"
                    aria-valuemin={0}
                    aria-valuemax={duration}
                    aria-valuenow={currentTime}
                    aria-label="Audio progress slider"
                  />
                  <span className="text-xs text-gray-500" aria-live="polite">
                    {formatTime(duration)}
                  </span>
                </div>
                <audio ref={audioRef} src={projectData.trackDemoPreview} className="hidden" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="trackDemo"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-[#f3e8ff] border-[#a259ff]"
                  aria-label="Upload track demo"
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
                    aria-label="Upload track demo file"
                  />
                </label>
              </div>
            )}
            {errors.trackDemo && <p className="text-red-500 text-sm mt-1">{errors.trackDemo}</p>}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={handleNext} className="w-full bg-[#0f172a] hover:bg-[#1e293b']">
          Continue to Royalty Splits
        </Button>
      </div>
    </div>
  );
}
