import styled from "@emotion/styled"

import { theme } from "../assets/styles/theme"

const ButtonStyled = styled.button`
	border: none;
	border-radius: ${theme.borderRadius.m};
	cursor: pointer;
`

export const ButtonWithTextStyled = styled(ButtonStyled)`
	padding: 0.3em 1.2em;
	width: fit-content;
	height: fit-content;

	color: ${theme.color.background};
	font-size: ${theme.fontSize.l};
	font-weight: 900;

	background-color: ${theme.color.interactive.basic};
	transition: background-color 0.3s ease;

	&:hover {
		background-color: ${theme.color.interactive.hover};
	}

	&:active {
		background-color: ${theme.color.interactive.active};
	}
`

export const ButtonIconStyled = styled(ButtonStyled)`
	position: relative;
	padding: 0;
	width: ${theme.fontSize.l};
	height: ${theme.fontSize.l};
	background-color: transparent;

	&::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		background-color: ${theme.color.interactive.basic};
		mask-image: var(--mask-image);
		mask-repeat: no-repeat;
		mask-position: center;
		mask-size: contain;

		transition: background-color 0.3s ease;
	}

	&:hover::after {
		background-color: ${theme.color.interactive.hover};
	}

	&:active::after {
		background-color: ${theme.color.interactive.active};
	}
`
