import orgSagas from './organizations';
import workspaceSagas from './workspaces';
import environmentSagas from './environments';
import userSagas from './users';
import contextSagas from './contextMgmt';

export default function* metaSagas() {
  yield [
    orgSagas(),
    workspaceSagas(),
    environmentSagas(),
    userSagas(),
    contextSagas(),
  ];
}
