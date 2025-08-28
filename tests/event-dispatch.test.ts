import EventDispatch from '../src/utils/event-dispatch';

describe('EventDispatch', () => {
  let eventDispatch: EventDispatch;

  beforeEach(() => {
    eventDispatch = new EventDispatch();
  });

  describe('on', () => {
    it('should register event listener', () => {
      const mockListener = jest.fn();
      
      eventDispatch.on('test-event', mockListener);
      
      expect(eventDispatch.listenerCount('test-event')).toBe(1);
    });

    it('should register multiple listeners for same event', () => {
      const mockListener1 = jest.fn();
      const mockListener2 = jest.fn();
      
      eventDispatch.on('test-event', mockListener1);
      eventDispatch.on('test-event', mockListener2);
      
      expect(eventDispatch.listenerCount('test-event')).toBe(2);
    });
  });

  describe('emit', () => {
    it('should emit event and call all listeners', () => {
      const mockListener1 = jest.fn();
      const mockListener2 = jest.fn();
      
      eventDispatch.on('test-event', mockListener1);
      eventDispatch.on('test-event', mockListener2);
      
      const result = eventDispatch.emit('test-event', 'arg1', 'arg2');
      
      expect(result).toBe(true);
      expect(mockListener1).toHaveBeenCalledWith('arg1', 'arg2');
      expect(mockListener2).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should return false if no listeners', () => {
      const result = eventDispatch.emit('non-existent-event');
      
      expect(result).toBe(false);
    });

    it('should handle listener errors gracefully', () => {
      const errorListener = jest.fn(() => {
        throw new Error('Test error');
      });
      const normalListener = jest.fn();
      
      eventDispatch.on('test-event', errorListener);
      eventDispatch.on('test-event', normalListener);
      
      // Mock console.error to avoid noise in test output
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = eventDispatch.emit('test-event');
      
      expect(result).toBe(true);
      expect(errorListener).toHaveBeenCalled();
      expect(normalListener).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('once', () => {
    it('should register one-time listener', () => {
      const mockListener = jest.fn();
      
      eventDispatch.once('test-event', mockListener);
      
      // First emit should call the listener
      eventDispatch.emit('test-event', 'arg1');
      expect(mockListener).toHaveBeenCalledTimes(1);
      expect(mockListener).toHaveBeenCalledWith('arg1');
      
      // Second emit should not call the listener
      eventDispatch.emit('test-event', 'arg2');
      expect(mockListener).toHaveBeenCalledTimes(1);
      
      expect(eventDispatch.listenerCount('test-event')).toBe(0);
    });
  });

  describe('off', () => {
    it('should remove specific listener', () => {
      const mockListener1 = jest.fn();
      const mockListener2 = jest.fn();
      
      eventDispatch.on('test-event', mockListener1);
      eventDispatch.on('test-event', mockListener2);
      
      const result = eventDispatch.off('test-event', mockListener1);
      
      expect(result).toBe(true);
      expect(eventDispatch.listenerCount('test-event')).toBe(1);
      
      eventDispatch.emit('test-event');
      expect(mockListener1).not.toHaveBeenCalled();
      expect(mockListener2).toHaveBeenCalled();
    });

    it('should remove all listeners if no specific listener provided', () => {
      const mockListener1 = jest.fn();
      const mockListener2 = jest.fn();
      
      eventDispatch.on('test-event', mockListener1);
      eventDispatch.on('test-event', mockListener2);
      
      const result = eventDispatch.off('test-event');
      
      expect(result).toBe(true);
      expect(eventDispatch.listenerCount('test-event')).toBe(0);
    });

    it('should return false if event does not exist', () => {
      const result = eventDispatch.off('non-existent-event', jest.fn());
      
      expect(result).toBe(false);
    });

    it('should return false if listener does not exist', () => {
      const mockListener = jest.fn();
      const otherListener = jest.fn();
      
      eventDispatch.on('test-event', mockListener);
      
      const result = eventDispatch.off('test-event', otherListener);
      
      expect(result).toBe(false);
      expect(eventDispatch.listenerCount('test-event')).toBe(1);
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all listeners for all events', () => {
      const mockListener1 = jest.fn();
      const mockListener2 = jest.fn();
      
      eventDispatch.on('event1', mockListener1);
      eventDispatch.on('event2', mockListener2);
      
      eventDispatch.removeAllListeners();
      
      expect(eventDispatch.listenerCount('event1')).toBe(0);
      expect(eventDispatch.listenerCount('event2')).toBe(0);
      expect(eventDispatch.eventNames()).toHaveLength(0);
    });
  });

  describe('listenerCount', () => {
    it('should return correct listener count', () => {
      const mockListener1 = jest.fn();
      const mockListener2 = jest.fn();
      
      expect(eventDispatch.listenerCount('test-event')).toBe(0);
      
      eventDispatch.on('test-event', mockListener1);
      expect(eventDispatch.listenerCount('test-event')).toBe(1);
      
      eventDispatch.on('test-event', mockListener2);
      expect(eventDispatch.listenerCount('test-event')).toBe(2);
    });
  });

  describe('eventNames', () => {
    it('should return array of event names', () => {
      eventDispatch.on('event1', jest.fn());
      eventDispatch.on('event2', jest.fn());
      
      const names = eventDispatch.eventNames();
      
      expect(names).toHaveLength(2);
      expect(names).toContain('event1');
      expect(names).toContain('event2');
    });
  });

  describe('listeners', () => {
    it('should return array of listeners for an event', () => {
      const mockListener1 = jest.fn();
      const mockListener2 = jest.fn();
      
      eventDispatch.on('test-event', mockListener1);
      eventDispatch.on('test-event', mockListener2);
      
      const listeners = eventDispatch.getListeners('test-event');
      
      expect(listeners).toHaveLength(2);
      expect(listeners).toContain(mockListener1);
      expect(listeners).toContain(mockListener2);
    });

    it('should return empty array for non-existent event', () => {
      const listeners = eventDispatch.getListeners('non-existent-event');
      
      expect(listeners).toHaveLength(0);
    });
  });
});