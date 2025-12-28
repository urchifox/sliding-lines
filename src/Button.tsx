import styled from "@emotion/styled"

import { theme } from "./assets/styles/theme"

const ButtonStyled = styled.button`
	border: none;
	border-radius: ${theme.borderRadius.m};

	cursor: pointer;
	background-color: ${theme.color.interactive.basic};
	transition: background-color 0.3s ease;

	&:hover {
		background-color: ${theme.color.interactive.hover};
	}

	&:active {
		background-color: ${theme.color.interactive.active};
	}
`

export const ButtonWithTextStyled = styled(ButtonStyled)`
	padding: 0.3em 1.2em;
	width: fit-content;
	height: fit-content;

	color: ${theme.color.background};
	font-size: ${theme.fontSize.l};
	font-weight: 900;
`

export const ButtonIconStyled = styled(ButtonStyled)`
	padding: 0;
	width: ${theme.fontSize.l};
	height: ${theme.fontSize.l};

	mask-repeat: no-repeat;
	mask-position: center;
	mask-size: contain;
`
