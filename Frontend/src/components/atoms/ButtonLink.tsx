import React from 'react';
import { Link } from 'react-router-dom';
import type{  LinkProps } from 'react-router-dom';
import clsx from 'clsx';

interface ButtonLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

const ButtonLink: React.FC<ButtonLinkProps> = ({ children, className, ...rest }) => {
  const defaultClass =
    'flex items-center text-indigo-600 hover:text-indigo-800 mr-4';

  return (
    <Link {...rest} className={clsx(defaultClass, className)}>
      {children}
    </Link>
  );
};

export default ButtonLink;