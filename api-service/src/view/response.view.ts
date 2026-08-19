export const getJoinedHTML = (appURL:string, workspaceTitle:string)=>{
    return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Workspace Joined</title>
        </head>

        <body class="min-h-screen flex items-center justify-center bg-slate-950 px-5 text-sky-50">

        <div class="fixed inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(56,189,248,.15),transparent_40%)]"></div>

        <main class="relative w-full max-w-md">
            <div class="rounded-3xl border border-sky-400/20 bg-slate-900/80 p-9 text-center shadow-2xl shadow-sky-950/40 backdrop-blur-xl">

            <!-- Success Icon -->
            <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-sky-400/10 ring-1 ring-sky-400/30">
                <span class="text-3xl text-sky-400">✓</span>
            </div>

            <h1 class="mb-3 text-3xl font-bold tracking-tight">
                You're in!
            </h1>

            <p class="mb-7 text-sm leading-6 text-slate-400">
                You've successfully joined
                <span class="font-semibold text-sky-300">${workspaceTitle}</span>.
                Your workspace is ready.
            </p>

            <!-- Workspace -->
            <div class="mb-7 rounded-2xl border border-sky-400/10 bg-sky-400/5 px-5 py-4">
                <p class="text-xs uppercase tracking-wider text-slate-500">
                Your new workspace
                </p>

                <p class="mt-1 text-lg font-semibold text-sky-100">
                ${workspaceTitle}
                </p>
            </div>

            <!-- CTA -->
            <a
                href=${appURL}
                class="block w-full rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 py-3.5 font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:-translate-y-0.5 hover:shadow-sky-500/30"
            >
                Go to your new workspace →
            </a>

            <p class="mt-6 text-xs text-slate-600">
                You can now collaborate with your team.
            </p>
            </div>
        </main>
    </body>
    </html> `
}

export const getVerificationSuccessHTML = (appURL:string)=>{
    return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verified</title>

        <script src="https://cdn.tailwindcss.com"></script>
        </head>

        <body class="min-h-screen flex items-center justify-center bg-blue-50 px-4">

        <div class="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">

            <div class="mx-auto mb-6 flex h-20 w-20 items-center justify-center
                        rounded-full bg-blue-100 text-4xl text-blue-600">
            ✓
            </div>

            <h1 class="mb-3 text-2xl font-bold text-slate-900">
            Email Verified Successfully!
            </h1>

            <p class="mb-7 text-sm leading-6 text-slate-500">
            Your email address has been successfully verified.
            Your account is now ready to use.
            </p>

            <a
            href=${appURL}
            class="block rounded-lg bg-blue-600 px-5 py-3 font-semibold
                    text-white transition hover:bg-blue-700"
            >
            Continue to Application →
            </a>

            <p class="mt-5 text-xs text-slate-400">
            You can safely close this window after continuing.
            </p>

        </div>

    </body>
    </html>`
}