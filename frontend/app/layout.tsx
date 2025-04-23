import type { Metadata } from "next"
import type { ReactNode } from "react"

import "@fontsource/lato"
import "@fontsource-variable/open-sans"
import "@app/styles/global.css"

export const metadata: Metadata = {
	title: "Kanban Board Clone",
	description: "A simple kanban board clone",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html lang="en">
			<body className="font-sans">{children}</body>
		</html>
	)
}
