import styled from "@emotion/styled"

const ButtonStyled = styled.button`
	padding: 12px 20px;
	border-radius: 6px;
	background-color: #007aff;
	color: white;
	font-size: 16px;
	border: none;
	cursor: pointer;

	&:hover {
		background-color: #005bb5;
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
