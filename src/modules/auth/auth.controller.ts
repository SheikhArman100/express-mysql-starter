import { Request, Response } from 'express';

import sendResponse from '../../shared/sendResponse';
import { AuthService } from './auth.service';
import catchAsync from '../../shared/catchAsync';
import status from 'http-status';
import ApiError from '../../errors/ApiError';
import { IUser } from '../user/user.interface';
import config from '../../config';
import { ENUM_COOKIE_NAME } from '../../enum/user';
import { UserInfoFromToken } from '../../types/common';

const signup = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.signup( req.body,
    req?.file);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message:
      'Signup successful! Please check your email to verify your account.',
    data: result,
  });
});
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    throw new ApiError(status.NOT_FOUND, 'Token not found');
  }

  const result = await AuthService.verifyEmail(token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Email Verification Successful',
    data: result,
  });
});

const resendVerification = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(status.BAD_REQUEST, 'Email is required');
  }

  const result = await AuthService.resendVerification(email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Verification email sent successfully',
    data: result,
  });
});

const signin = catchAsync(async (req: Request, res: Response) => {
  const existingRefreshToken = req?.cookies?.[ENUM_COOKIE_NAME.REFRESH_TOKEN];
  const { refreshToken, ...result } = await AuthService.signin(
    req.body as { email: string; password: string },
    existingRefreshToken,
  );
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  };

  res.cookie(ENUM_COOKIE_NAME.REFRESH_TOKEN, refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Signin successful!',
    data: result,
  });
});


const updateToken = catchAsync(async (req: Request, res: Response) => {
  const cookies = req?.cookies?.[ENUM_COOKIE_NAME.REFRESH_TOKEN];

  if (!cookies) {
    throw new ApiError(status.UNAUTHORIZED, 'Please sign in first');
  }

  res.clearCookie(ENUM_COOKIE_NAME.REFRESH_TOKEN, {
    secure: config.env === 'production',
    httpOnly: true,
  });

  const { refreshToken, ...result } = await AuthService.updateToken(cookies);
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  };

  res.cookie(ENUM_COOKIE_NAME.REFRESH_TOKEN, refreshToken, cookieOptions);

  if (!result) {
    res.clearCookie(ENUM_COOKIE_NAME.REFRESH_TOKEN, {
      secure: config.env === 'production',
      httpOnly: true,
    });

    throw new ApiError(status.UNAUTHORIZED, 'You are not authorized');
  }

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Token updated successfully',
    data: result,
  });
});

const signOut = catchAsync(async (req: Request, res: Response) => {
  const refreshToken = req?.cookies?.[ENUM_COOKIE_NAME.REFRESH_TOKEN];

  if (!refreshToken) {
    throw new ApiError(status.UNAUTHORIZED, 'Please sign in first');
  }

  const result = await AuthService.signOut(refreshToken);

  
  res.clearCookie(ENUM_COOKIE_NAME.REFRESH_TOKEN, {
    secure: config.env === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Signed out successfully',
  });
});

const checkUser = catchAsync(async (req: Request, res: Response) => {
  const cookies = req?.cookies?.[ENUM_COOKIE_NAME.REFRESH_TOKEN];

  if (!cookies) {
    throw new ApiError(status.UNAUTHORIZED, 'Please sign in first');
  }

  const result = await AuthService.checkUser(cookies);

  // The service layer throws an ApiError if not authorized, so !result is effectively unreachable here.
  // However, if for some reason it returns null/undefined, it's still an unauthorized state.
  if (!result) {
    res.clearCookie(ENUM_COOKIE_NAME.REFRESH_TOKEN, {
      secure: config.env === 'production',
      httpOnly: true,
    });

    throw new ApiError(status.UNAUTHORIZED, 'You are not authorized');
  }

  return sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Authorized User',
    data: result,
  });
});

export const AuthController = {
  signup,
  verifyEmail,
  resendVerification,
  signin,
  updateToken,
  signOut,
  checkUser
};
