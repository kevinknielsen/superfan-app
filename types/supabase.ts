export type Project = {
  id: string;
  creator_id: string | null; // Should never be null for new projects
  title: string;
  artist_name: string;
  description: string | null;
  cover_art_url: string | null;
  track_demo_url: string | null;
  voice_intro_url: string | null;
  status: string;
  platform_fee_pct: number;
  early_curator_shares: boolean;
  created_at: string;
  splits_contract_address?: string | null;
};

export type TeamMember = {
  id: string;
  project_id: string;
  role: string | null;
  name: string | null;
  email: string | null;
  wallet_address: string | null;
  revenue_share_pct: number | null;
};

export type Milestone = {
  id: string;
  project_id: string;
  title: string | null;
  description: string | null;
  due_date: string | null;
  requires_approval: boolean;
};

export type Financing = {
  id: string;
  project_id: string;
  enabled: boolean | null;
  target_raise: number | null;
  min_contribution: number | null;
  max_contribution: number | null;
  start_date: string | null;
  end_date: string | null;
};

export type CuratorPitch = {
  id: string;
  project_id: string;
  curator_id: string | null;
};

export type ProjectData = Project & {
  enableFinancing: boolean;
  targetRaise: number | null;
  minContribution: number | null;
  maxContribution: number | null;
  startDate: string | null;
  endDate: string | null;
  selectedCurators: Curator[];
};

export type Curator = {
  id: string;
  name: string;
  avatar: string | null;
  selected: boolean;
};

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at">;
        Update: Partial<Omit<Project, "id" | "created_at">>;
      };
      team_members: {
        Row: TeamMember;
        Insert: Omit<TeamMember, "id">;
        Update: Partial<Omit<TeamMember, "id">>;
      };
      milestones: {
        Row: Milestone;
        Insert: Omit<Milestone, "id">;
        Update: Partial<Omit<Milestone, "id">>;
      };
      financing: {
        Row: Financing;
        Insert: Omit<Financing, "id">;
        Update: Partial<Omit<Financing, "id">>;
      };
      curator_pitches: {
        Row: CuratorPitch;
        Insert: Omit<CuratorPitch, "id">;
        Update: Partial<Omit<CuratorPitch, "id">>;
      };
    };
  };
};
