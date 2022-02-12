from multiprocessing import Process, Pipe
import json

PLAYER = 'o'
OPPONENT = 'x'

MIN = -1000
MAX = 1000

class Counter:
    def __init__(self):
        self.count = 0
    def inc(self):
        self.count += 1
    def get(self):
        return self.count

WIN_CONS = [
	[0, 1, 2, 3, 4],
	[5, 6, 7, 8, 9],
	[10, 11, 12, 13, 14],
	[15, 16, 17, 18, 19],
	[20, 21, 22, 23, 24],
	[0, 5, 10, 15, 20],
	[1, 6, 11, 16, 21],
	[2, 7, 12, 17, 22],
	[3, 8, 13, 18, 23],
	[4, 9, 14, 19, 24],
	[0, 6, 12, 18, 24],
	[4, 8, 12, 16, 20],
]

def isMovesLeft(board):
    for i in range(25):
        if (board[i] == None):
            return True
    return False

def evaluate(b):
    for con in WIN_CONS:
        win = True
        for i in con:
            if b[i] is None or b[i] != b[con[0]]:
                win = False
                break
        if win:
            if b[con[0]] == PLAYER:
                return 100
            if b[con[0]] == OPPONENT:
                return -100
    return 0

def minimax(board, depth, isMax, alpha, beta, c):
    c.inc()
    score = evaluate(board)
    if (score == 100) :
        return (score - depth)
    if (score == -100) :
        return (score + depth)
    if (isMovesLeft(board) == False) :
        return 0
    if depth >= 7:
        return 0
    if (isMax):
        best = MIN
        for i in range(25):
            if (board[i] == None):
                board[i] = PLAYER
                best = max(best, minimax(board, depth + 1, not isMax, alpha, beta, c))
                alpha = max(alpha, best)
                board[i] = None
                if beta <= alpha:
                    break
        return best
    best = MAX
    for i in range(25):
        if (board[i] == None):
            board[i] = OPPONENT
            best = min(best, minimax(board, depth + 1, not isMax, alpha, beta, c))
            beta = min(beta, best)
            board[i] = None
            if beta <= alpha:
                break
    return best

def mini_driver(board, i, pipe):
    c = Counter()
    move_score = minimax(board, 0, False, MIN, MAX, c)
    count = c.get()
    pipe.send({'to': i, 'score': move_score, 'count': count})
    pipe.close()


class Mini:
    def __init__(self, board) -> None:
        self.board = board
    def best_move(self):
        best_score = MIN
        processes = []
        parent_connections = []
        for i in range(25):
            if self.board[i] is None:
                copy = self.board.copy()
                copy[i] = PLAYER
                parent, child_conn = Pipe()
                parent_connections.append(parent)
                process = Process(target=mini_driver, args=(copy, i, child_conn))
                processes.append(process)
        for process in processes:
            process.start()
        for process in processes:
            process.join()
        moves = []
        for parent in parent_connections:
            moves.append(parent.recv())
        sum_moves = 0
        for move in moves:
            sum_moves += move['count']
            if move['score'] > best_score:
                best_score = move['score']
        best_moves = [move for move in moves if move['score'] == best_score]
        return {'moves': best_moves, 'move_count': sum_moves}

def lambda_handler(event, context):
    data = event['body']
    body = json.loads(data)
    board = body['board']
    print(board)
    alg = Mini(board)
    results = alg.best_move()
    response = json.dumps({'moves': results['moves'], 'checked': results['move_count']})
    return {
        'statusCode': 200,
        'body': response
    }