import sagas from './index';

describe('Sagas Index', () => {
  let result;
  const rootSaga = sagas();

  // This test is to mostly appease test coverage
  it('should load metaSagas', () => {
    result = rootSaga.next();
    expect(result.value.length).to.equal(21);
  });
});
