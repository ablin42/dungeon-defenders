import { Router } from "express";
import { registerV1Routes } from "./V1/V1Routes";

export default function registerRoutes(router: Router) {
    registerV1Routes(router);
}