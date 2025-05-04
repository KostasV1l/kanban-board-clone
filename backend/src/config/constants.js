const ROLES = Object.freeze({
  OWNER: "OWNER",
  EDITOR: "EDITOR",
  VIEWER: "VIEWER",
});

const rolePermissions = Object.freeze({
  [ROLES.OWNER]: [ROLES.OWNER, ROLES.EDITOR, ROLES.VIEWER],
  [ROLES.EDITOR]: [ROLES.EDITOR, ROLES.VIEWER],
  [ROLES.VIEWER]: [ROLES.VIEWER],
});

const TASK_STATUS = Object.freeze({
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
});

const TASK_PRIORITY = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
});

module.exports = {
  ROLES,
  rolePermissions,
  TASK_STATUS,
  TASK_PRIORITY,
};
