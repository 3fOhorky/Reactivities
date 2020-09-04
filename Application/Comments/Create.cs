using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<CommentDto>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Command, CommentDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _map;
            public Handler(DataContext context, IMapper map)
            {
                _map = map;
                _context = context;
            }

            public async Task<CommentDto> Handle(Command request, CancellationToken cancellationToken)
            {
                // koristimo WebSockets (SignalR) umjesto http request-a pa ne možemo dohvatiti username preko IUserContext
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == request.Username);

                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null) throw new RestException(HttpStatusCode.NotFound, new { Actvity = "Not found" });

                var comment = new Comment
                {
                    Body = request.Body,
                    Author = user,
                    Activity = activity,
                    CreatedAt = DateTime.Now
                };

                _context.Comments.Add(comment);

                var success = await _context.SaveChangesAsync() > 0;
                if (success) return _map.Map<Comment, CommentDto>(comment);

                throw new Exception("Problem saving changes");
            }
        }
    }
}