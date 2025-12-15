import styled from "@emotion/styled"

const slideSize = 2

export const PageStyled = styled.section`
	position: relative;

	padding: 2em;
	width: 100%;
	height: 100vh;
	height: 100dvh;

	display: grid;
	justify-items: center;
	justify-content: center;
	align-items: center;
	align-content: center;
	gap: 1em;

	overflow: hidden;

	@keyframes slide-in-from-left {
		from {
			opacity: 0;
			transform: translateX(-${slideSize}em);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slide-in-from-right {
		from {
			opacity: 0;
			transform: translateX(${slideSize}em);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slide-out-to-left {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(-${slideSize}em);
		}
	}

	@keyframes slide-out-to-right {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(${slideSize}em);
		}
	}

	@keyframes appear {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes disappear {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
`
