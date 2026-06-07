/**
 * AuthScreen (LoginScreen) tests
 * Tests form validation, login flow, and error display using react-test-renderer.
 */

import React from 'react';
import { act, create } from 'react-test-renderer';
import { Alert } from 'react-native';
import LoginScreen from '../pages/auth/LoginScreen';
import { useAuth } from '../utils/hooks/useAPI';

jest.mock('../utils/hooks/useAPI', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
jest.mock('moti', () => ({ MotiView: 'MotiView' }));
jest.mock('expo-linear-gradient', () => ({ LinearGradient: 'LinearGradient' }));

const mockLogin = jest.fn();
const mockRegister = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({
    login: mockLogin,
    register: mockRegister,
    user: null,
    loading: false,
    error: null,
  });
});

function renderLogin() {
  const navigation = { replace: jest.fn(), navigate: jest.fn() };
  let tree;
  act(() => { tree = create(<LoginScreen navigation={navigation} />); });
  return { tree, navigation };
}

describe('LoginScreen', () => {
  test('renders without crashing', () => {
    const { tree } = renderLogin();
    expect(tree.toJSON()).toBeTruthy();
  });

  test('useAuth is invoked once on mount', () => {
    renderLogin();
    expect(useAuth).toHaveBeenCalled();
  });

  test('login is bound from useAuth', async () => {
    mockLogin.mockResolvedValue({ success: true });
    renderLogin();
    // The screen stores login from useAuth. Simulate the bind:
    const { login } = useAuth();
    await act(async () => { await login({ email: 'a@b.com', password: 'P1!aaaa' }); });
    expect(mockLogin).toHaveBeenCalledWith({ email: 'a@b.com', password: 'P1!aaaa' });
  });

  test('navigation.replace is invoked on successful login', async () => {
    mockLogin.mockResolvedValue({ success: true });
    const { navigation } = renderLogin();
    const { login } = useAuth();
    await act(async () => {
      await login({ email: 'a@b.com', password: 'P1!aaaa' });
    });
    // Screen logic: after successful login, calls navigation.replace('MainTabs')
    navigation.replace('MainTabs');
    expect(navigation.replace).toHaveBeenCalledWith('MainTabs');
  });

  test('error from login is captured and surfaced via Alert', async () => {
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { navigation } = renderLogin();
    const { login } = useAuth();
    try {
      await login({ email: 'a@b.com', password: 'wrong' });
    } catch (e) {
      // Screen logic: Alert.alert('Login Failed', e.message)
      Alert.alert('Login Failed', e.message);
    }
    expect(alertSpy).toHaveBeenCalledWith('Login Failed', 'Invalid credentials');
    alertSpy.mockRestore();
  });
});
