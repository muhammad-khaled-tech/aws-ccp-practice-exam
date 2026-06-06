export interface BaseQuestion {
  id: string; // unique ID, e.g., 'p-e1q1' or 'et-1'
  text: string;
  options: { letter: string; text: string }[];
  correct: string[];
  isMulti: boolean;
  tag: string;
  domain: string;
  communityVote?: string;
  discussionUrl?: string;
  source: 'practice' | 'examtopics';
  examNumber?: number;
}

export interface UserProgress {
  answered: boolean;
  correct: boolean;
  selected: string[];
  flagged?: boolean;
}

export interface QuizSession {
  type: 'practice' | 'mock' | 'dumps_custom' | 'dumps_range' | 'incorrect_review';
  label: string;
  questions: BaseQuestion[];
  isTimed: boolean;
  initialTime: number; // in seconds, 0 for unlimited
  studyMode: boolean; // instantly show correct answer on select
}
