import orgSagas from './organizations';
import workspaceSagas from './workspaces';
import environmentSagas from './environments';
import lambdaSagas from './lambdas';
import selfSagas from './self';
import contextSagas from './contextMgmt';

export default function* metaSagas() {
  yield [
    orgSagas(),
    workspaceSagas(),
    environmentSagas(),
    lambdaSagas(),
    selfSagas(),
    contextSagas(),
  ];
}
