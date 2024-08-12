import React, { useEffect, useState } from 'react';
import CBSEJSON from '../../utils/boardWiseForms.json'; // Adjust the path as needed

interface Props {
  gradeLevel?: string;
  subject?: string;
  chapter?: string;
  onInputChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChapterDescriptionChange?: (description: string) => void; // New prop to pass chapter description
}

const GradeSubjectChapterForm: React.FC<Props> = ({ gradeLevel, subject, chapter, onInputChange, onChapterDescriptionChange }) => {
  const [chapters] = useState<{ name: string, description: string }[]>([]);

  const getSubjectsForGrade = (grade: string) => {
    const selectedGrade = CBSEJSON?.CBSEForms?.Grades.find(item => item.grade === grade);
    return selectedGrade ? Object.keys(selectedGrade.Subjects) : [];
  };

  const getChaptersForSubject = (grade: string, subject: string) => {
    const selectedGrade = CBSEJSON?.CBSEForms?.Grades.find(item => item.grade === grade);
    if (selectedGrade && selectedGrade.Subjects[subject]) {
      return selectedGrade.Subjects[subject].Chapters.map(chapter => ({
        name: chapter.name,
        description: chapter.description
      }));
    }
    return [];
  };

  useEffect(() => {
    if (gradeLevel && subject && chapter) {
      const selectedGrade = CBSEJSON?.CBSEForms?.Grades.find(item => item.grade === gradeLevel);
      if (selectedGrade && selectedGrade.Subjects[subject]) {
        const selectedChapter = selectedGrade.Subjects[subject].Chapters.find(chap => chap.name === chapter);
        if (selectedChapter) {
          onChapterDescriptionChange(selectedChapter.description); // Send the chapter description to the parent
        } else {
          onChapterDescriptionChange(''); // Clear description if chapter not found
        }
      } else {
        onChapterDescriptionChange(''); // Clear description if subject not found
      }
    }
  }, [gradeLevel, subject, chapter, onChapterDescriptionChange]);

  return (
    <form className='board-forms-prefix'>
      <div className='form-group'>
        <label htmlFor='gradeLevel'>Grade Level<span className="asterisk">*</span></label>
        <select
          required
          className='form-control'
          name="gradeLevel"
          onChange={onInputChange}
          value={gradeLevel}
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
          value={subject}
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
          value={chapter}
          placeholder="Select the relevant chapter name">
          <option value="">Please Select Chapter</option>
          {gradeLevel && subject && getChaptersForSubject(gradeLevel, subject).map((chap, index) => (
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
