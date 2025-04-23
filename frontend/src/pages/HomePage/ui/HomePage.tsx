import Link from "next/link"

const HomePage = () => {
    return (
        <div>
            <p>
                Hello from{" "}
                <Link href="https://github.com/yunglocokid" target="_blank">
                    yunglocokid
                </Link>
            </p>
            <pre data-testid="hint-code">
                You can edit <span>src/pages/HomePage</span> to start {"<3"}!<br />
                <small>You can also test your application using Jest :D. Try it!</small>
            </pre>
        </div>
    )
}

export default HomePage
