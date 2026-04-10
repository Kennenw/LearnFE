import { useState } from "react";
import { LoginDTO, RegisterDTO } from "../dtos/auth-dto";
import { AuthController } from "../controller/auth-controller";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(false);

    const login = async (payload: LoginDTO) => {
        try {
            setLoading(true);
            await AuthController.login(payload);
            setStatus(true);
        } finally {
            setLoading(false);
        }
    };

    const register = async (payload: RegisterDTO) => {
        try {
            setLoading(true);
            await AuthController.register(payload);
            setStatus(true);
        } finally {
            setLoading(false);
        }
    };

    return {
        status,
        loading,
        login,
        register
    };
}