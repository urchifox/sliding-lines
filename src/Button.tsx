import styled from "@emotion/styled"
import { theme } from "./assets/styles/theme"

const ButtonStyled = styled.button`
	border: none;
	border-radius: ${theme.borderRadius.m};
	padding: 0.3em 1.2em;
	width: fit-content;

	cursor: pointer;
	background-color: ${theme.color.interactive.basic};
	transition: background-color 0.3s ease;
	
	color: ${theme.color.background};
	font-size: ${theme.fontSize.l};
	font-weight: 900;

	&:hover {
		background-color:  ${theme.color.interactive.hover};
	}

	&:active {
		background-color:  ${theme.color.interactive.active};
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
