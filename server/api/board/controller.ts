import { boardrepository } from '$/repository/boardrepositry';
import { userColorRepository } from '$/repository/userColorRepository';
import { defineController } from './$relay';

export default defineController(() => ({
  get: ({ user }) => ({
    status: 200,
    body: {
      board: boardrepository.getBoard().board,
      turnColor: boardrepository.getBoard().turnColor,
      me_color: userColorRepository.getUserColor(user.id),
      black_number: boardrepository.getBoard().black_number,
      white_number: boardrepository.getBoard().white_number,
    },
  }),

  post: ({ body, user }) => ({
    status: 201,
    body: { board: boardrepository.clickBoard(body, user.id) },
  }),
}));
