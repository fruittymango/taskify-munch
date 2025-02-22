import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import humanId from "human-id";
import { v4 as uuidv4 } from "uuid";
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

describe("Manage projects - api level", () => {
    describe("unathorised access of resource", () => {
        test("should not get projects - unauthorised user", async () => {
            try {
                await axios.get("http://127.0.0.1:5000/projects");
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
    describe("athorised access of resource", () => {
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
            } catch (error: Error | AxiosError | any) {
                if (error instanceof AxiosError) {
                    expect(error.response?.status).toBe(400);
                    expect(error.response?.data.error).toBe(
                        "User profile exist already."
                    );
                }
            }
        });

        test("should not get any projects - projects do not exist", async () => {
            const result2 = await axios.get("http://127.0.0.1:5000/projects/");
            expect(result2.data.length).toBe(0);
            expect(result2.status).toBe(200);
        });

        test("should not add one project - schema invalid", async () => {
            try {
                const invalidBody = {
                    name: "TestName",
                    content: "Surname",
                };

                await axios.post("http://127.0.0.1:5000/projects", {
                    ...invalidBody,
                });
            } catch (error: Error | AxiosError | any) {
                if (error instanceof AxiosError) {
                    expect(error.response?.status).toBe(422);
                    expect(error.response?.data.error).toBe(
                        "Api schema validation failed. Please find taskify-much documentation!"
                    );
                }
            }
        });
        test("should add one project - project does not exist", async () => {
            const addProjectBody = {
                title: "Project Name",
                description: "Like tahat",
            };
            const result = await axios.post("http://127.0.0.1:5000/projects", {
                ...addProjectBody,
            });

            expect(result.data.title).toBe(addProjectBody.title);
            expect(result.data.description).toBe(addProjectBody.description);
            expect(result.status).toBe(200);
        });
        test("should not add one project - project does exist", async () => {
            try {
                const validBody = {
                    title: "Project Name",
                    description: "Like tahat",
                };

                await axios.post("http://127.0.0.1:5000/projects", {
                    ...validBody,
                });
            } catch (error: Error | AxiosError | any) {
                if (error instanceof AxiosError) {
                    expect(error.response?.status).toBe(422);
                    expect(error.response?.data.error).toBe(
                        "Failed to create the project."
                    );
                }
            }
        });

        test("should not get one project - schema invalid", async () => {
            try {
                await axios.get("http://127.0.0.1:5000/projects/1");
            } catch (error: Error | AxiosError | any) {
                if (error instanceof AxiosError) {
                    expect(error.response?.status).toBe(422);
                }
            }
        });

        test("should not get one project - valid guid does not exist", async () => {
            try {
                const validGuid = uuidv4();
                await axios.get(`http://127.0.0.1:5000/projects/${validGuid}`);
            } catch (error: Error | AxiosError | any) {
                if (error instanceof AxiosError) {
                    expect(error.response?.status).toBe(422);
                    expect(error.response?.data.error).toBe(
                        "Failed to get project using guid."
                    );
                }
            }
        });
        test("should get projects - projects do exist", async () => {
            const result = await axios.get("http://127.0.0.1:5000/projects");
            expect(result.data.length).toBeGreaterThan(0);
            expect(result.status).toBe(200);
        });
        test("should get one project - project does exist", async () => {
            const getProjects = await axios.get(
                "http://127.0.0.1:5000/projects"
            );
            expect(getProjects.data.length).toBe(1);
            expect(getProjects.data[0].guid).toBeTruthy();
            expect(getProjects.status).toBe(200);
            const result = await axios.get(
                `http://127.0.0.1:5000/projects/${getProjects.data[0].guid}`
            );
            expect(result.status).toBe(200);
            expect(getProjects.data[0].guid).toBe(result.data.guid);
        });
    });
});
