import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AddCommentDto } from './dto/addComment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiTags('Comments')
  @Post('comment/:articleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Comment article for admin and user' })
  async comment(
    @Param('articleId') articleId: number,
    @Req() req,
    @Body() addCommentDto: AddCommentDto,
  ) {
    return await this.commentService.addComment(
      addCommentDto,
      +articleId,
      req.user.id,
    );
  }
}
