export const parseFeedbackString = (str: string, isUpdate: boolean = false) => {
  if (isUpdate) {
    return {
      summary: str,
    };
  }

  const firstNameMatch = str.match(/\*\*First name\*\*: (.+)/);
  const lastNameMatch = str.match(/\*\*Last name\*\*: (.+)/);
  const nativeLanguageMatch = str.match(/\*\*Native language\*\*: (.+)/);
  const foreignLanguageMatch = str.match(/\*\*Foreign language\*\*: (.+)/);
  const roleMatch = str.match(/\*\*Role\*\*: (.+)/);
  const feedbackMatch = str.match(/\*\*Feedback\*\*:([\s\S]*)/);

  return {
    firstName: firstNameMatch ? firstNameMatch[1].trim() : '',
    lastName: lastNameMatch ? lastNameMatch[1].trim() : '',
    nativeLanguage: nativeLanguageMatch ? nativeLanguageMatch[1].trim() : '',
    foreignLanguage: foreignLanguageMatch ? foreignLanguageMatch[1].trim() : '',
    role: roleMatch ? roleMatch[1].trim() : '',
    summary: feedbackMatch ? feedbackMatch[1].trim() : '',
  };
};