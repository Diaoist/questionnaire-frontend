let env = 'dev';
let prefix = '';
let csprefix = '';

if (env === 'dev') {
  prefix = '';
} else {
  prefix = '';
}

export default {
  test: prefix + '',
  USER_LOGIN: prefix + '',
  QUESTIONNAIRE_UPDATE: prefix + '/question/questionnaire/update',
  QUESTIONNAIRE_DELETE: prefix + '/question/questionnaire/delete',
  QUESTIONNAIRE_INSERT: prefix + '/question/questionnaire/insert',
  QUESTIONNAIRE_SELETE: prefix + '/question/questionnaire/select',
  QUESTION_INSERT: prefix + 'question/question/insert',
  QUESTION_UPDATE: prefix + 'question/question/update',
  QUESTION_SELETE: prefix + 'question/question/select'
}