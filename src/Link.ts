import styled from "@emotion/styled"
import { theme } from "./assets/styles/theme"

export const LinkStyled = styled.a`
	color: ${theme.color.interactive.basic};
	cursor: pointer;
	transition: color 0.3s ease;

	&:hover {
		color: ${theme.color.interactive.hover};
	}

	&:active {
		color: ${theme.color.interactive.active};
	}
`
