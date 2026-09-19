"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import { Header } from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { InputField } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { InlineAlert } from "@/components/ui/ErrorState";
import { isValidEmail, isValidPasswordLength } from "@/lib/validation";
import { getFriendlyErrorMessage } from "@/lib/errors";

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const { register } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    const errors: FieldErrors = {};

    if (!isValidEmail(email)) {
      errors.email = "Enter a valid email address.";
    }

    if (!isValidPasswordLength(password)) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      router.push("/dashboard");
    } catch (error) {
      setFormError(getFriendlyErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-sm">
          <CardHeader className="border-none pb-0 pt-5">
            <div>
              <CardTitle className="text-lg">
                Create your account
              </CardTitle>
              <CardDescription>
                Start building personalized interview prep kits.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              {formError && <InlineAlert message={formError} />}

              <InputField
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={fieldErrors.email}
                required
                placeholder="you@example.com"
              />

              <InputField
                label="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={fieldErrors.password}
                hint={!fieldErrors.password ? "At least 8 characters" : undefined}
                required
                placeholder="••••••••"
              />

              <InputField
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                error={fieldErrors.confirmPassword}
                required
                placeholder="••••••••"
              />

              <Button
                type="submit"
                loading={loading}
                className="mt-1 w-full justify-center"
              >
                Create account
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-brand-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
