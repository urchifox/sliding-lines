import styled from "@emotion/styled"

import { theme } from "./assets/styles/theme"

export const TextStyled = styled.p<{
	marginTop?: string
	marginBottom?: string
	color?: string
}>(
	({ marginTop, marginBottom }) => `
    margin-inline: 0;
    margin-top: ${marginTop ?? "1em"};
    margin-bottom: ${marginBottom ?? "1em"};
	text-align: center;
	color: ${theme.color.primary};
    font-size: ${theme.fontSize.m};
`
)
