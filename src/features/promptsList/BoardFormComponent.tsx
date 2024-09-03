import React, { useEffect, useState, useCallback } from 'react';
import CBSEJSON from '../../utils/boardWiseForms.json';

interface Props {
  gradeLevel?: string;
  subject?: string;
  chapter?: string;
  onInputChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChapterDescriptionChange?: (description: string) => void;
}

const GradeSubjectChapterForm: React.FC<Props> = ({
  gradeLevel,
  subject,
  chapter,
  onInputChange,
  onChapterDescriptionChange
}) => {
  const [chapters, setChapters] = useState<{ name: string, description: string }[]>([]);

  const getSubjectsForGrade = useCallback((grade: string) => {
    const selectedGrade = CBSEJSON?.CBSEForms?.Grades.find(item => item.grade === grade);
    return selectedGrade ? Object.keys(selectedGrade.Subjects) : [];
  }, []);

  const getChaptersForSubject = useCallback((grade: string, subject: string) => {
    const selectedGrade = CBSEJSON?.CBSEForms?.Grades.find(item => item.grade === grade);
    if (selectedGrade && selectedGrade.Subjects[subject]) {
      return selectedGrade.Subjects[subject].Chapters.map(chapter => ({
        name: chapter.name,
        description: chapter.description
      }));
    }
    return [];
  }, []);

  useEffect(() => {
    if (gradeLevel && subject) {
      const chaptersForSubject = getChaptersForSubject(gradeLevel, subject);
      setChapters(chaptersForSubject);
    }
  }, [gradeLevel, subject, getChaptersForSubject]);

  useEffect(() => {
    if (chapter) {
      const selectedChapter = chapters.find((chap) => chap.name === chapter);
      onChapterDescriptionChange?.(selectedChapter ? selectedChapter.description : '');
    } else {
      onChapterDescriptionChange?.('');
    }
  }, [chapter, chapters, onChapterDescriptionChange]);

  return (
    <form className='board-forms-prefix'>
      <div className='form-group'>
        <label htmlFor='gradeLevel'>Grade Level<span className="asterisk">*</span></label>
        <select
          required
          className='form-control'
          name="gradeLevel"
          onChange={onInputChange}
          value={gradeLevel || ''}
          placeholder="Select the grade level for which the questions are being created">
          <option value="">Please Select Grade</option>
          {CBSEJSON.CBSEForms.Grades.map((item, index) => (
            <option key={index} value={item.grade}>
              {item.grade}
            </option>
          ))}
        </select>
      </div>

      <div className='form-group'>
        <label htmlFor='subject'>Subject<span className="asterisk">*</span></label>
        <select
          required
          className='form-control'
          name="subject"
          onChange={onInputChange}
          value={subject || ''}
          placeholder="Select Subject">
          <option value="">Please Select Subject</option>
          {gradeLevel && getSubjectsForGrade(gradeLevel).map((sub, index) => (
            <option key={index} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      <div className='form-group'>
        <label htmlFor='chapter'>Chapter<span className="asterisk">*</span></label>
        <select
          required
          className='form-control'
          name="chapter"
          onChange={onInputChange}
          value={chapter || ''}
          placeholder="Select the relevant chapter name">
          <option value="">Please Select Chapter</option>
          {gradeLevel && subject && chapters.map((chap, index) => (
            <option key={index} value={chap.name}>
              {chap.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
};

export default GradeSubjectChapterForm;
