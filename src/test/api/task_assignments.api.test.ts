import { v4 as uuidv4 } from "uuid";
import humanId from "human-id";
import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import axios, { AxiosError } from "axios";

import { startServer, stopServer } from "../../server";
import { delay } from "../../utils/delay";

beforeAll(async () => {
    await startServer();
    await delay(2000);
});

afterAll(async () => {
    await stopServer();
});

describe("Manage tasks assignments", () => {
    describe("unauthorised access of resource", () => {
        test("should not add task assignments - unauthorised user", async () => {
            try {
                await axios.post(
                    "http://127.0.0.1:5000/assign/task/" + uuidv4(),
                    {
                        userId: 1,
                    }
                );
            } catch (error) {
                if (error instanceof AxiosError) {
                    expect(error.response?.status).toBe(401);
                    expect(error.response?.data.error).toBe(
                        "User unauthorized! Login required."
                    );
                }
            }
        });

        test("should not delete task assignments - unauthorised user", async () => {
            try {
                await axios.delete(
                    "http://127.0.0.1:5000/assign/task/" + uuidv4(),
                    {
                        data: {
                            userId: 1,
                        },
                    }
                );
            } catch (error) {
                if (error instanceof AxiosError) {
                    expect(error.response?.status).toBe(401);
                    expect(error.response?.data.error).toBe(
                        "User unauthorized! Login required."
                    );
                }
            }
        });
    });

    describe("authorised access of resource", () => {
        beforeAll(async () => {
            try {
                const validBody = {
                    name: "Test" + humanId(),
                    surname: "Test" + humanId(),
                    email: humanId() + "@gmail.com",
                    password: humanId(),
                };

                await axios.post("http://127.0.0.1:5000/users/register", {
                    ...validBody,
                });

                await axios.post("http://127.0.0.1:5000/users/register", {
                    ...validBody,
                    email: humanId() + validBody.email,
                });

                const result = await axios.post(
                    "http://127.0.0.1:5000/users/login",
                    {
                        email: validBody.email,
                        password: validBody.password,
                    }
                );
                expect(result?.status).toBe(200);
                expect(result?.data.token).toBeTruthy();
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${result.data.token}`;

                const addProjectBody = {
                    title: humanId(),
                    description: humanId(),
                };
                const addProjectResult = await axios.post(
                    "http://127.0.0.1:5000/projects",
                    { ...addProjectBody }
                );
                expect(addProjectResult.data.title).toBe(addProjectBody.title);
                expect(addProjectResult.status).toBe(200);

                const projects = await axios.get(
                    "http://127.0.0.1:5000/projects"
                );
                expect(projects.data.length).toBeGreaterThan(0);
                expect(projects.status).toBe(200);

                const labels = await axios.get("http://127.0.0.1:5000/labels");
                expect(labels.data.length).toBeGreaterThan(0);
                expect(labels.status).toBe(200);

                const priorities = await axios.get(
                    "http://127.0.0.1:5000/priorities"
                );
                expect(priorities.data.length).toBeGreaterThan(0);
                expect(priorities.status).toBe(200);

                const today = new Date();
                const futureDate = new Date(today);
                futureDate.setDate(today.getDate() + 7);
                const addTaskBody = {
                    title: humanId(),
                    description: uuidv4(),
                    dueDate: futureDate.toISOString().split("T")[0],
                    labelId: labels.data[0].id,
                    projectId: projects.data[0].id,
                    priorityId: priorities.data[0].id,
                    statusId: 1,
                };

                const addTaskResult = await axios.post(
                    "http://127.0.0.1:5000/tasks",
                    { ...addTaskBody }
                );
                expect(addTaskResult.status).toBe(200);
                expect(addTaskResult.data.title).toBe(addTaskBody.title);
                expect(addTaskResult.data.description).toBe(
                    addTaskBody.description
                );
            } catch (error: Error | AxiosError | any) {
                if (error instanceof AxiosError) {
                    expect(error.response?.status).toBe(400);
                    expect(error.response?.data.error).toBe(
                        "User profile exist already."
                    );
                }
            }
        });

        test("should get tasks with assignments - array empty", async () => {
            const projects = await axios.get("http://127.0.0.1:5000/projects");
            expect(projects.status).toBe(200);
            expect(projects.data.length).toBeGreaterThan(0);

            const tasks = await axios.get(
                "http://127.0.0.1:5000/tasks?projectGuid=" +
                    projects.data[0].guid
            );
            expect(tasks.status).toBe(200);
            expect(tasks.data.length).toBeGreaterThan(0);
            expect(tasks.data[0].task_assignments?.length).toBe(0);

            const result = await axios.get(
                "http://127.0.0.1:5000/tasks/" + tasks.data[0].guid
            );
            expect(result.status).toBe(200);
            expect(result.data.task_assignments.length).toBe(0);
        });

        describe("adding task assignment", () => {
            test("should not add task assignment - schema invalid", async () => {
                try {
                    await axios.post(
                        "http://127.0.0.1:5000/assign/task/" + uuidv4(),
                        { userd: 1 }
                    );
                } catch (error) {
                    if (error instanceof AxiosError) {
                        expect(error.response?.status).toBe(422);
                        expect(error.response?.data.error).toBe(
                            "Api schema validation failed. Please find taskify-much documentation!"
                        );
                    }
                }
            });

            test("should not add one task assignment - task does not exist", async () => {
                try {
                    await axios.post(
                        "http://127.0.0.1:5000/assign/task/" + uuidv4(),
                        { userId: 1 }
                    );
                } catch (error) {
                    if (error instanceof AxiosError) {
                        expect(error.response?.status).toBe(422);
                        expect(error.response?.data.error).toBe(
                            "Failed to get task for project using guid."
                        );
                    }
                }
            });
        });

        test("should get tasks with assignments - array not empty", async () => {
            const projects = await axios.get("http://127.0.0.1:5000/projects");
            expect(projects.status).toBe(200);
            expect(projects.data.length).toBeGreaterThan(0);

            const tasks = await axios.get(
                "http://127.0.0.1:5000/tasks?projectGuid=" +
                    projects.data[0].guid
            );
            expect(tasks.status).toBe(200);
            expect(tasks.data.length).toBeGreaterThan(0);
            expect(tasks.data[0].task_assignments.length).toBe(0);

            const assignTaskBody = { userId: 1 };
            const addTaskAssignmentResult = await axios.post(
                "http://127.0.0.1:5000/assign/task/" + tasks.data[0].guid,
                { ...assignTaskBody }
            );

            expect(addTaskAssignmentResult.status).toBe(200);
            expect(addTaskAssignmentResult.data.userId).toBe(
                addTaskAssignmentResult.data.userId
            );

            const tasks2 = await axios.get(
                "http://127.0.0.1:5000/tasks?projectGuid=" +
                    projects.data[0].guid
            );
            expect(tasks2.status).toBe(200);
            expect(tasks2.data.length).toBeGreaterThan(0);
            expect(tasks2.data[0].task_assignments.length).toBe(1);
        });

        test("should not get tasks assigned to you - array empty", async () => {
            const projects = await axios.get("http://127.0.0.1:5000/projects");
            expect(projects.status).toBe(200);
            expect(projects.data.length).toBeGreaterThan(0);

            const tasks = await axios.get(
                "http://127.0.0.1:5000/tasks/assigned?projectGuid=" +
                    projects.data[0].guid
            );
            expect(tasks.status).toBe(200);
            expect(tasks.data.length).toBeGreaterThan(0);
            expect(tasks.data[0].task_assignments.length).toBe(1);

            const assignTaskBody = { userId: 2 };
            const addTaskAssignmentResult = await axios.post(
                "http://127.0.0.1:5000/assign/task/" + tasks.data[0].guid,
                { ...assignTaskBody }
            );

            expect(addTaskAssignmentResult.status).toBe(200);
            expect(addTaskAssignmentResult.data.userId).toBe(
                addTaskAssignmentResult.data.userId
            );

            const tasks2 = await axios.get(
                "http://127.0.0.1:5000/tasks/assigned?projectGuid=" +
                    projects.data[0].guid
            );
            expect(tasks2.status).toBe(200);
            expect(tasks2.data.length).toBeGreaterThan(0);
            expect(tasks2.data[0].task_assignments.length).toBe(1);
        });

        test("should get tasks assigned to you - array not empty", async () => {
            const projects = await axios.get("http://127.0.0.1:5000/projects");
            expect(projects.status).toBe(200);
            expect(projects.data.length).toBeGreaterThan(0);

            const tasks = await axios.get(
                "http://127.0.0.1:5000/tasks/assigned?projectGuid=" +
                    projects.data[0].guid
            );
            expect(tasks.status).toBe(200);
            expect(tasks.data.length).toBeGreaterThan(0);
            expect(tasks.data[0].task_assignments.length).toBe(1);

            const assignTaskBody = { userId: 1 };
            const addTaskAssignmentResult = await axios.post(
                "http://127.0.0.1:5000/assign/task/" + tasks.data[0].guid,
                { ...assignTaskBody }
            );

            expect(addTaskAssignmentResult.status).toBe(200);
            expect(addTaskAssignmentResult.data.userId).toBe(
                addTaskAssignmentResult.data.userId
            );

            const tasks2 = await axios.get(
                "http://127.0.0.1:5000/tasks/assigned?projectGuid=" +
                    projects.data[0].guid
            );
            expect(tasks2.status).toBe(200);
            expect(tasks2.data.length).toBeGreaterThan(0);
            expect(tasks2.data[0].task_assignments.length).toBeGreaterThan(0);
        });

        describe("removing task assignments", () => {
            test("should not remove one task assignment - user does not exist", async () => {
                try {
                    const projects = await axios.get(
                        "http://127.0.0.1:5000/projects"
                    );
                    expect(projects.status).toBe(200);
                    expect(projects.data.length).toBeGreaterThan(0);

                    const tasks = await axios.get(
                        "http://127.0.0.1:5000/tasks?projectGuid=" +
                            projects.data[0].guid
                    );
                    expect(tasks.status).toBe(200);
                    expect(tasks.data.length).toBeGreaterThan(0);
                    expect(tasks.data[0].task_assignments.length).toBe(1);

                    const assignTaskBody = { userId: 10 };
                    await axios.delete(
                        "http://127.0.0.1:5000/assign/task/" +
                            tasks.data[0].guid,
                        { data: { ...assignTaskBody } }
                    );
                } catch (error) {
                    if (error instanceof AxiosError) {
                        expect(error.response?.status).toBe(422);
                        expect(error.response?.data.error).toBe(
                            "Failed to get user by id."
                        );
                    }
                }
            });
            test("should remove one task assignment - task does exist", async () => {
                const projects = await axios.get(
                    "http://127.0.0.1:5000/projects"
                );
                expect(projects.status).toBe(200);
                expect(projects.data.length).toBeGreaterThan(0);

                const tasks = await axios.get(
                    "http://127.0.0.1:5000/tasks?projectGuid=" +
                        projects.data[0].guid
                );
                expect(tasks.status).toBe(200);
                expect(tasks.data.length).toBeGreaterThan(0);
                expect(tasks.data[0].task_assignments.length).toBe(2);

                const assignTaskBody = { userId: 1 };
                const deleteTaskAssignmentResult = await axios.delete(
                    "http://127.0.0.1:5000/assign/task/" + tasks.data[0].guid,
                    { data: { ...assignTaskBody } }
                );

                expect(deleteTaskAssignmentResult.status).toBe(200);
                expect(deleteTaskAssignmentResult.data.userId).toBe(
                    deleteTaskAssignmentResult.data.userId
                );

                const tasks2 = await axios.get(
                    "http://127.0.0.1:5000/tasks?projectGuid=" +
                        projects.data[0].guid
                );
                expect(tasks2.status).toBe(200);
                expect(tasks2.data.length).toBeGreaterThan(0);
                expect(tasks2.data[0].task_assignments.length).toBeLessThan(
                    tasks.data[0].task_assignments.length
                );
            });
        });
    });
});
