import { getStrictestHadithGrade } from './grading';

describe('getStrictestHadithGrade', () => {
  it('returns Sahih when all scholars agree it is Sahih', () => {
    expect(getStrictestHadithGrade('abudawud', 4)).toBe('Sahih');
  });

  it('returns Hasan when the strongest available grade is Hasan', () => {
    expect(getStrictestHadithGrade('abudawud', 8)).toBe('Hasan');
  });

  it('returns Da\'if when any scholar marks it weak', () => {
    expect(getStrictestHadithGrade('abudawud', 2)).toBe("Da'if");
  });

  it('returns null when the hadith is ungraded', () => {
    expect(getStrictestHadithGrade('abudawud', 999999)).toBeNull();
  });
});