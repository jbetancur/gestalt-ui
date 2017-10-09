import contextSagas from './contextMgmt';

export default function* contextMgmtSagas() {
  yield [
    contextSagas(),
  ];
}
