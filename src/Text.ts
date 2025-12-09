import styled from "@emotion/styled"

import { theme } from "./assets/styles/theme"

export const TextStyled = styled.p<{
	marginTop?: number
	marginBottom?: number
    color?: string
}>(
	({ marginTop, marginBottom }) => `
    margin-inline: 0;
    margin-top: ${marginTop ? marginTop + "px" : "1em"};
    margin-bottom: ${marginBottom ? marginBottom + "px" : "1em"};
	text-align: center;
	color: ${theme.color.primary};
    font-size: ${theme.fontSize.m};
`
)
