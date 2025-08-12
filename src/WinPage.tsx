import { AppRoute } from "./App"

export function WinPage({
    setPage,
}: {
    setPage: React.Dispatch<React.SetStateAction<AppRoute>>
}) {
    const handleStartClick = () => {
        setPage(AppRoute.Game)
    }

    return (
        <section>
            <h1>Вы выиграли!</h1>
            <button onClick={handleStartClick}>Сыграть еще</button>
        </section>
    )
}
