type ActionType = 'created' | 'updated' | 'deleted';

interface IAction {
  type: ActionType;
}

export function SuccessMessage(entity: string, action: IAction): string {
  switch (action.type) {
    case 'created':
      return `${entity} has been created successfully`;
    case 'updated':
      return `${entity} has been updated successfully`;
    case 'deleted':
      return `${entity} has been deleted successfully`;
    default:
      return '';
  }
}
