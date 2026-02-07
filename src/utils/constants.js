export const UserRoles = {
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    MEMBER: "member",
};

export const AvailableRoles = Object.values(UserRoles);

export const TaskStatus = {
    TOGO: "todo",
    IN_PROGRESS: "in_progress",
    FINISHED: "finished",
}

export const AvailableTaskStatuses = Object.values(TaskStatus);