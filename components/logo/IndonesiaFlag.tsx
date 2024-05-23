import { SVGProps } from "react";

export function IndonesiaFlag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="2rem"
      height="2rem"
      viewBox="0 0 64 64"
      {...props}
    >
      <path
        fill="#f9f9f9"
        d="M31.8 62c16.6 0 30-13.4 30-30h-60c0 16.6 13.4 30 30 30"
      ></path>
      <path
        fill="#ed4c5c"
        d="M31.8 2c-16.6 0-30 13.4-30 30h60c0-16.6-13.4-30-30-30"
      ></path>
    </svg>
  );
}
