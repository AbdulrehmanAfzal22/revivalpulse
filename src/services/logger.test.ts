import { createLogger, getMinLogLevel, resetMinLogLevel, setMinLogLevel } from './logger';

describe('logger', () => {
  afterEach(() => {
    resetMinLogLevel();
    jest.restoreAllMocks();
  });

  it('prefixes every message with the namespace', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    setMinLogLevel('debug');
    createLogger('my-feature').warn('something happened', { detail: 1 });
    expect(spy).toHaveBeenCalledWith('[my-feature]', 'something happened', { detail: 1 });
  });

  it('suppresses debug and info below the configured minimum level', () => {
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => undefined);
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    setMinLogLevel('warn');

    const logger = createLogger('test');
    // eslint-disable-next-line testing-library/no-debugging-utils -- this is Logger.debug, not screen.debug; the rule only matches the method name.
    logger.debug('quiet');
    logger.info('also quiet');

    expect(debugSpy).not.toHaveBeenCalled();
    expect(infoSpy).not.toHaveBeenCalled();
  });

  it('always allows warn and error through once the level is at warn or above', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    setMinLogLevel('warn');

    const logger = createLogger('test');
    logger.warn('a warning');
    logger.error('an error');

    expect(warnSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('allows debug output once the level is lowered to debug', () => {
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => undefined);
    setMinLogLevel('debug');
    // eslint-disable-next-line testing-library/no-debugging-utils -- this is Logger.debug, not screen.debug; the rule only matches the method name.
    createLogger('test').debug('now visible');
    expect(debugSpy).toHaveBeenCalled();
  });

  it('resetMinLogLevel restores the environment-appropriate default', () => {
    setMinLogLevel('error');
    resetMinLogLevel();
    // In the Jest/CRA test environment NODE_ENV is 'test', not 'production', so the default is 'debug'.
    expect(getMinLogLevel()).toBe('debug');
  });

  it('each namespace gets its own independent, correctly-prefixed logger', () => {
    const infoSpy = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    setMinLogLevel('debug');
    createLogger('feature-a').info('from a');
    createLogger('feature-b').info('from b');
    expect(infoSpy).toHaveBeenNthCalledWith(1, '[feature-a]', 'from a');
    expect(infoSpy).toHaveBeenNthCalledWith(2, '[feature-b]', 'from b');
  });
});
