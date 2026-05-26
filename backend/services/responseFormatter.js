function formatResponse(answer) {
  const text = String(answer || '').trim();

  if (!text) {
    return 'I could not find the answer in the uploaded PDF.';
  }

  return text
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

module.exports = { formatResponse };
