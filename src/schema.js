const Joi = require('joi');

const extendedJoi = Joi.extend({
  type: 'stringList',
  base: Joi.array(),
  coerce: {
    from: 'string',
    method(value) {
      value = value.trim();
      if (value) {
        value = value
          .split(',')
          .map(item => item.trim())
          .filter(Boolean);
      }

      return {value};
    }
  }
}).extend({
  type: 'processOnly',
  base: Joi.string(),
  coerce: {
    from: 'string',
    method(value) {
      value = value.trim();
      if (['issues', 'prs'].includes(value)) {
        value = value.slice(0, -1);
      }

      return {value};
    }
  }
});

const schema = Joi.object({
  'github-token': Joi.string().trim().max(100),

  'exempt-issue-labels': Joi.alternatives()
    .try(
      extendedJoi
        .stringList()
        .items(Joi.string().trim().max(50))
        .min(1)
        .max(30)
        .unique(),
      Joi.string().trim().valid('')
    )
    .default(''),

  'issue-comment': Joi.string()
    .trim()
    .max(10000)
    .allow('')
    .default(
      ':wave: @{comment-author}, would you like to leave a reaction instead?'
    ),

  'exempt-pr-labels': Joi.alternatives()
    .try(
      extendedJoi
        .stringList()
        .items(Joi.string().trim().max(50))
        .min(1)
        .max(30)
        .unique(),
      Joi.string().trim().valid('')
    )
    .default(''),

  'pr-comment': Joi.string()
    .trim()
    .max(10000)
    .allow('')
    .default(
      ':wave: @{comment-author}, would you like to leave a reaction instead?'
    ),

  'process-only': extendedJoi.processOnly().valid('issue', 'pr', '').default('')
});

module.exports = schema;
