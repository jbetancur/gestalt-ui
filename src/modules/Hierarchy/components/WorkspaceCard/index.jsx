import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/Buttons';
import { Card, CardTitle, CardActions } from 'components/GFCard';
import { FormattedRelative } from 'react-intl';

class WorkspaceCard extends PureComponent {
  static propTypes = {
    router: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    setCurrentWorkspaceContext: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
  };

  navWorkspaceDetails(item) {
    const { router, params, setCurrentWorkspaceContext } = this.props;

    router.push(`/${params.fqon}/hierarchy/${item.id}`);
    setCurrentWorkspaceContext(item);
  }

  edit(e, workspace) {
    e.stopPropagation();

    const { params, router } = this.props;

    router.push(`/${params.fqon}/hierarchy/${workspace.id}/editWorkspace`);
  }

  render() {
    const { t, model } = this.props;

    return (
      <Card key={model.id} className="flex-4 flex-xs-12 workspace-card" onClick={e => this.navWorkspaceDetails(model, e)} raise typeSymbol="W" typeColor="#42a5f5">
        <CardTitle
          title={model.description || model.name}
          subtitle={
            <div>
              <div className="gf-caption">owner: {model.owner.name}</div>
              <div className="gf-caption">created <FormattedRelative value={model.created.timestamp} /></div>
              <div className="gf-caption">modified <FormattedRelative value={model.modified.timestamp} /></div>
            </div>
          }
        />
        <CardActions>
          <Button
            tooltipLabel={t('general.verbs.edit')}
            icon
            onClick={e => this.edit(e, model)}
          >
            edit
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default WorkspaceCard;
