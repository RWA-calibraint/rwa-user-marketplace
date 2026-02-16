import { FormInstance } from 'antd';
import React, { ReactNode } from 'react';

export interface ProfileProps {
  isLoading: boolean;
  handleSave: () => void;
  userDetails: UserDetails;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  imageFile: File | null;
}
export interface AddressProps {
  isLoading: boolean;
  handleSave: () => void;
  userDetails: UserDetails;
  form: FormInstance<unknown>;
}
export interface UserDetails {
  _id: string;
  status: string;
  password: string;
  cognitoSubId: string;
  stripeAccountId: string;
  firstName: string;
  lastName: string;
  userId: string;
  suspendExpiryAt: string | null;
  description: string;
  email: string;
  phoneNumber: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  postalCode?: string;
  profilePic?: string;
  kycVerified?: string;
}

export interface EmptyStateProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick: () => void;
  icon: ReactNode;
  hasPlus?: boolean;
  loading?: boolean;
}
