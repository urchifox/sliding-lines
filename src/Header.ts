import styled from "@emotion/styled"

import { theme } from "./assets/styles/theme"

export const HeaderStyled = styled.h1<{
	marginTop?: string
	marginBottom?: string
}>(
	({ marginTop, marginBottom }) => `
    margin-inline: 0;
    margin-top: ${marginTop ?? "0"};
    margin-bottom: ${marginBottom ?? "2em"};
	text-align: center;
	color: ${theme.color.primary};
    font-size: ${theme.fontSize.xl};
`
)
