import styled from "@emotion/styled"

const ButtonStyled = styled.button`
	border: none;
	border-radius: 6px;
	padding: 12px 20px;
	width: fit-content;

	cursor: pointer;
	background-color: #b463ca;
	transition: background-color 0.3s ease;
	
	color: white;
	font-size: 22px;
	font-weight: 900;

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
