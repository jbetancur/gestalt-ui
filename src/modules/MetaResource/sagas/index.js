import orgSagas from './organizations';
import workspaceSagas from './workspaces';
import environmentSagas from './environments';
import selfSagas from './self';
import contextSagas from './contextMgmt';

export default function* metaSagas() {
  yield [
    orgSagas(),
    workspaceSagas(),
    environmentSagas(),
    selfSagas(),
    contextSagas(),
  ];
}
