export interface PublicQuestion {
  id: string;
  questionText: string;
  firstName: string | null;
  company: string | null;
  keepAnonymous: boolean;
  answerText: string;
  publishedSlug: string;
  createdAt: string;
}