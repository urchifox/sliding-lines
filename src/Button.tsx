import styled from "@emotion/styled"

const ButtonStyled = styled.button`
	padding: 12px 20px;
	border-radius: 6px;
	background-color: #b463ca;
	color: white;
	font-size: 16px;
	border: none;
	cursor: pointer;
	transition: background-color 0.3s ease;

	&:hover {
		background-color: #6e209a;
	}
`

export function Button({
	text,
	onClick,
}: {
	text: string
	onClick?: () => void
}) {
	return <ButtonStyled onClick={onClick}>{text}</ButtonStyled>
}
