import styled, { css } from "styled-components";

const variants = {
  outline: css`
    background: #fff;
    border: 1px solid #e5e7eb;
    color: #111827;
    &:hover { background: #f7f7f8; }
  `,
  solid: css`
    background: #111827;
    color: #fff;
    border: 0;
    &:hover { opacity: .92; }
  `
};

const Button = styled.button`
  padding: 10px 14px;
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;
  ${({variant}) => variants[variant || "outline"]};
`;

export default Button;
